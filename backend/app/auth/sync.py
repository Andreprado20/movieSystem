import logging
import firebase_admin
from firebase_admin import auth
from firebase_admin.auth import UserRecord
from supabase import Client

logger = logging.getLogger(__name__)

class UserSynchronizer:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client

    async def create_user_in_supabase(self, firebase_user: UserRecord):
        """
        Create a user in Supabase that matches a Firebase user
        """
        try:
            # Passo 1: Verificar se o usuário já existe no banco de dados Supabase
            existing_user = await self._check_existing_user(firebase_user.email)
            if existing_user:
                logger.info(f"Usuário {firebase_user.email} já existe no Supabase DB, sincronização concluída.")
                return True
                
            # Passo 2: Se não existir no DB, tentar inserir o usuário
            try:
                # Criar o registro diretamente (sem verificar Auth)
                user_record = await self._create_user_record(firebase_user, None)
                if user_record:
                    return True
            except Exception as db_error:
                logger.error(f"Erro ao criar usuário no DB: {str(db_error)}")
                # Continuar para tentar criar no Auth e depois tentar novamente no DB
            
            # Passo 3: Se não conseguiu criar no DB, verificar/criar no Auth e tentar novamente
            auth_user = await self._get_or_create_supabase_auth_user(firebase_user)
            if auth_user:
                # Tentar criar o registro no DB novamente
                user_record = await self._create_user_record(firebase_user, auth_user)
                if user_record:
                    return True
            
            # Se chegou aqui, houve algum problema
            logger.error(f"Não foi possível sincronizar o usuário {firebase_user.email} após todas as tentativas.")
            return False
        except Exception as e:
            logger.error(f"Erro ao sincronizar usuário: {str(e)}")
            return False

    async def _check_existing_user(self, email: str):
        """Check if user already exists in Usuario table"""
        try:
            response = self.supabase.table("Usuario").select("*").eq("email", email).execute()
            return response.data and len(response.data) > 0
        except Exception as e:
            logger.error(f"Error checking existing user: {str(e)}")
            return False

    async def _get_supabase_auth_user(self, email: str):
        """Get user from Supabase Auth by email"""
        try:
            # Use the admin.list_users() method instead of get_user_by_email
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
            # Create a random password that meets Supabase requirements
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
                "email_confirm": True
            }
            
            response = self.supabase.auth.admin.create_user(user_data)
            return response.user
        except Exception as e:
            logger.error(f"Failed to create auth user: {str(e)}")
            raise e

    async def _create_user_record(self, firebase_user: UserRecord, supabase_auth_user):
        """
        Create a user record in the database
        """
        # Check if user already exists in database
        try:
            response = self.supabase.table("Usuario").select("*").eq("email", firebase_user.email).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            
            # Create user in database with only the necessary fields
            user_data = {
                "nome": firebase_user.display_name or firebase_user.email.split('@')[0],
                "email": firebase_user.email,
                "senha": "firebase_auth_user"  # Mark as Firebase auth user
            }
            
            # Insert the user without specifying ID
            response = self.supabase.table("Usuario").insert(user_data).execute()
            
            if not response.data or len(response.data) == 0:
                logger.error("Failed to create user record: No data returned")
                return None
                
            # Create default profile for user
            user_id = response.data[0]["id"]
            profile_data = {
                "tipo": "usuario",
                "nome": user_data["nome"],
                "usuario_id": user_id
            }
            
            profile_response = self.supabase.table("Perfil").insert(profile_data).execute()
            
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
    
    def on_user_create(user_record, context):
        """
        Firebase Auth user creation hook
        """
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(synchronizer.create_user_in_supabase(user_record))
        finally:
            loop.close()
    
    # We need to use the auth.create_user_flow hook - this would normally require a 
    # Callable/Cloud Function, but for local development we can manually trigger
    # synchronization after user creation in our API routes
    
    return synchronizer 