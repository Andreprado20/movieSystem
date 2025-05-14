import logging
import firebase_admin
from firebase_admin import auth
from firebase_admin.auth import UserRecord
from supabase import Client
import asyncio
from functools import wraps
from fastapi import Header, HTTPException, Request, Depends, status
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

logger = logging.getLogger(__name__)

def run_async(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            coroutine = f(*args, **kwargs)
            return loop.run_until_complete(coroutine)
        finally:
            loop.close()
    return wrapper

class UserSynchronizer:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client

    async def create_user_in_supabase(self, firebase_user: UserRecord):
        """
        Create a user in Supabase that matches a Firebase user
        """
        try:
            # Step 1: Check if user already exists in Supabase DB
            existing_user = await self._check_existing_user(firebase_user.uid)
            if existing_user:
                #logger.info(f"User {firebase_user.email} already exists in Supabase DB, synchronization complete.")
                return existing_user
                
            # Step 2: Try to create user in Supabase Auth if they don't exist there
            supabase_auth_user = await self._get_or_create_supabase_auth_user(firebase_user)
            
            # Step 3: Create user record in Usuario table
            user_record = await self._create_user_record(firebase_user, supabase_auth_user)
            if user_record:
                #logger.info(f"Successfully synchronized user {firebase_user.email} to Supabase")
                
                # Step 4: Assign 'authenticated' role to Firebase user
                try:
                    auth.set_custom_user_claims(firebase_user.uid, {'role': 'authenticated'})
                    #logger.info(f"Added 'authenticated' role to Firebase user {firebase_user.uid}")
                except Exception as e:
                    logger.error(f"Failed to set custom claim for user {firebase_user.uid}: {str(e)}")
                
                return user_record
            
            # If we got here, something went wrong
            logger.error(f"Failed to synchronize user {firebase_user.email} after all attempts.")
            return False
        except Exception as e:
            logger.error(f"Error synchronizing user: {str(e)}")
            return False

    async def update_user_in_supabase(self, firebase_user: UserRecord):
        """
        Update a user in Supabase to match Firebase user
        """
        try:
            # First check if user exists in Supabase
            existing_user = await self._check_existing_user(firebase_user.uid)
            if not existing_user:
                # If user doesn't exist, create them
                return await self.create_user_in_supabase(firebase_user)
                
            # Update user record in Usuario table
            user_data = {
                "nome": firebase_user.display_name or firebase_user.email.split('@')[0],
                "email": firebase_user.email,
            }
            
            # Update the user
            try:
                response = self.supabase.table("Usuario").update(user_data).eq("firebase_uid", firebase_user.uid).execute()
                #logger.info(f"Updated user {firebase_user.email} in Supabase")
                return response.data[0] if response.data and len(response.data) > 0 else None
            except Exception as e:
                logger.error(f"Failed to update user record: {str(e)}")
                return None
                
        except Exception as e:
            logger.error(f"Error updating user in Supabase: {str(e)}")
            return False

    async def delete_user_from_supabase(self, firebase_uid: str):
        """
        Delete a user from Supabase when deleted from Firebase
        """
        try:
            # Delete from Usuario table first (this will cascade to profiles)
            response = self.supabase.table("Usuario").delete().eq("firebase_uid", firebase_uid).execute()
            
            # Try to delete from Supabase Auth if possible
            try:
                # Get user from Supabase Auth by firebase_uid
                users = self.supabase.auth.admin.list_users()
                for user in users.users:
                    # Check user metadata for firebase_uid
                    if user.app_metadata and user.app_metadata.get('firebase_uid') == firebase_uid:
                        self.supabase.auth.admin.delete_user(user.id)
                        #logger.info(f"Deleted user with firebase_uid {firebase_uid} from Supabase Auth")
                        break
            except Exception as auth_e:
                logger.error(f"Failed to delete user from Supabase Auth: {str(auth_e)}")
            
            #logger.info(f"Deleted user with firebase_uid {firebase_uid} from Supabase DB")
            return True
        except Exception as e:
            logger.error(f"Error deleting user from Supabase: {str(e)}")
            return False

    async def _check_existing_user(self, firebase_uid: str):
        """Check if user already exists in Usuario table by Firebase UID"""
        try:
            response = self.supabase.table("Usuario").select("*").eq("firebase_uid", firebase_uid).execute()
            return response.data[0] if response.data and len(response.data) > 0 else None
        except Exception as e:
            logger.error(f"Error checking existing user: {str(e)}")
            return None

    async def _get_supabase_auth_user(self, email: str):
        """Get user from Supabase Auth by email"""
        try:
            # Use the admin.list_users() method to find user by email
            response = self.supabase.auth.admin.list_users()
            if not hasattr(response, 'users'):
                logger.error("Unexpected response format from auth.admin.list_users()")
                return None
                
            # Find the user with the matching email
            for user in response.users:
                if user.email == email:
                    return user
                    
            return None
        except Exception as e:
            logger.error(f"Error getting auth user: {str(e)}")
            return None

    async def _get_or_create_supabase_auth_user(self, firebase_user: UserRecord):
        """
        Get or create a user in Supabase Auth
        """
        # Check if user already exists in Supabase Auth
        existing_user = await self._get_supabase_auth_user(firebase_user.email)
        if existing_user:
            return existing_user
        
        # Create user in Supabase Auth
        try:
            # Generate a secure random password
            import random
            import string
            # Generate a random password with uppercase, lowercase, numbers, and special chars
            random_password = ''.join([
                random.choice(string.ascii_uppercase),
                random.choice(string.ascii_lowercase),
                random.choice(string.digits),
                random.choice('!@#$%^&*()'),
                ''.join(random.choice(string.ascii_letters + string.digits + '!@#$%^&*()') for _ in range(8))
            ])
            
            user_data = {
                "email": firebase_user.email,
                "password": random_password,
                "email_confirm": True,
                "app_metadata": {
                    "firebase_uid": firebase_user.uid,
                    "provider": "firebase"
                },
                "user_metadata": {
                    "display_name": firebase_user.display_name or firebase_user.email.split('@')[0]
                }
            }
            
            response = self.supabase.auth.admin.create_user(user_data)
            #logger.info(f"Created user {firebase_user.email} in Supabase Auth")
            return response.user
        except Exception as e:
            logger.error(f"Failed to create auth user: {str(e)}")
            raise e

    async def _create_user_record(self, firebase_user: UserRecord, supabase_auth_user):
        """
        Create a user record in the database
        """
        try:
            # Create user in database with necessary fields
            user_data = {
                "nome": firebase_user.display_name or firebase_user.email.split('@')[0],
                "email": firebase_user.email,
                "senha": "firebase_auth_user",  # Mark as Firebase auth user
                "firebase_uid": firebase_user.uid,
                "auth_provider": "firebase"
            }
            
            # Add Supabase auth ID if available
            if supabase_auth_user and hasattr(supabase_auth_user, 'id'):
                user_data["supabase_uid"] = supabase_auth_user.id
            
            # Insert the user
            response = self.supabase.table("Usuario").insert(user_data).execute()
            
            if not response.data or len(response.data) == 0:
                logger.error("Failed to create user record: No data returned")
                return None
                
            # Create default profile for user
            user_id = response.data[0]["id"]
            profile_data = {
                "tipo": "usuario",
                "nome": user_data["nome"],
                "usuario_id": user_id,
                "descricao": f"Profile for {user_data['nome']}"
            }
            
            profile_response = self.supabase.table("Perfil").insert(profile_data).execute()
            #logger.info(f"Created profile for user {firebase_user.email}")
            
            return response.data[0]
        except Exception as e:
            logger.error(f"Failed to create user record: {str(e)}")
            raise e

# Firebase Auth event handlers
def setup_firebase_auth_hooks(supabase_client: Client):
    """
    Setup Firebase Auth hooks to synchronize users with Supabase
    """
    synchronizer = UserSynchronizer(supabase_client)
    
    # Register auth user event handlers
    @run_async
    async def on_user_create(user_record, context):
        """Firebase Auth user creation hook"""
        #logger.info(f"Firebase user created: {user_record.uid}")
        return await synchronizer.create_user_in_supabase(user_record)
    
    @run_async
    async def on_user_update(user_record, context):
        """Firebase Auth user update hook"""
        #logger.info(f"Firebase user updated: {user_record.uid}")
        return await synchronizer.update_user_in_supabase(user_record)
    
    @run_async
    async def on_user_delete(user_record, context):
        """Firebase Auth user deletion hook"""
        #logger.info(f"Firebase user deleted: {user_record.uid}")
        return await synchronizer.delete_user_from_supabase(user_record.uid)
    
    # We can't register these hooks directly with Firebase locally
    # However, we can manually trigger them from our API routes
    
    return synchronizer

# Utility functions for authentication
async def get_current_user(
    request: Request = None,
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    Get the current authenticated user from either Firebase token or JWT token.
    
    Args:
        request: The FastAPI request object
        authorization: The Authorization header containing the Bearer token
        
    Returns:
        Dict containing user information including uid and email
        
    Raises:
        HTTPException: If authentication fails
    """
    # For testing purposes, allow None request and authorization
    if request is None:
        # Return a mock user for tests (this should be mocked in tests)
        return {"uid": "test-user-id", "email": "test@example.com"}
        
    # Normal token-based authentication
    if not authorization:
        logger.error("Authorization header missing")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Authorization header missing"
        )
    
    token = authorization.replace("Bearer ", "")
    logger.info(f"Attempting to verify token: {token[:10]}...")
    
    # First try to validate as a Firebase token
    try:
        from firebase_admin import auth
        user = auth.verify_id_token(token)
        logger.info(f"Successfully authenticated user with Firebase: {user.get('uid')}")
        return user
    except Exception as firebase_error:
        # If Firebase validation fails, try as a JWT token
        try:
            # JWT token validation
            # Use the same secret key as in create_access_token
            SECRET_KEY = "your-secret-key"  # For development only
            ALGORITHM = "HS256"
            
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            
            if not user_id:
                raise jwt.InvalidTokenError("Token missing 'sub' claim")
                
            # If using Supabase, get the user from the database
            if request and hasattr(request.app.state, "supabase"):
                supabase = request.app.state.supabase
                user_result = supabase.table("Usuario").select("*").eq("id", user_id).execute()
                
                if not user_result.data or len(user_result.data) == 0:
                    raise HTTPException(status_code=404, detail="User not found")
                    
                user_data = user_result.data[0]
                
                # Return in a format similar to Firebase user
                return {
                    "uid": str(user_data["id"]),
                    "email": user_data["email"],
                    "name": user_data["nome"],
                    "auth_time": int(datetime.now().timestamp()),
                    "user_id": str(user_data["id"])
                }
            else:
                # Minimal user data if no database connection
                return {
                    "uid": str(user_id),
                    "user_id": str(user_id),
                    "auth_time": int(datetime.now().timestamp())
                }
                
        except (jwt.PyJWTError, HTTPException) as jwt_error:
            # If both validations fail, log the errors and raise exception
            error_msg = f"Firebase error: {str(firebase_error)}. JWT error: {str(jwt_error)}"
            logger.error(f"Authentication failed: {error_msg}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid authentication token: {error_msg}"
            )

def create_access_token(data: dict, expires_delta=None):
    """
    Create a JWT access token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    
    to_encode.update({"exp": expire})
    
    # Use a proper secret key in production
    # This should be from environment variables
    SECRET_KEY = "your-secret-key"  # For development only
    ALGORITHM = "HS256"
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    """
    Verify a password against a hash
    
    For Firebase auth users, we skip password verification
    as Firebase handles authentication
    """
    # Special case for Firebase-authenticated users
    if hashed_password == "firebase_auth_user":
        # For Firebase users, we don't verify passwords directly
        return True
        
    # For regular users, use passlib/bcrypt
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """
    Create a password hash
    """
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(password) 