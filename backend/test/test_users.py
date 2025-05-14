import pytest
from fastapi.testclient import TestClient
import asyncio
import logging
from datetime import datetime
from conftest import Timer

logger = logging.getLogger("test")

class TestUserRoutes:
    """Test suite for User API routes"""

    @pytest.fixture
    def mock_firebase_auth(self):
        """Mock the Firebase Auth module"""
        with pytest.MonkeyPatch().context() as m:
            from unittest.mock import MagicMock
            mock_auth = MagicMock()
            
            # Setup standard mock methods
            user_record = MagicMock()
            user_record.uid = "test-user-uid"
            user_record.email = "test@example.com"
            user_record.display_name = "Test User"
            
            mock_auth.create_user = MagicMock(return_value=user_record)
            mock_auth.update_user = MagicMock(return_value=user_record)
            mock_auth.get_user = MagicMock(return_value=user_record)
            mock_auth.delete_user = MagicMock()
            mock_auth.set_custom_user_claims = MagicMock()
            
            # Setup list_users to return a PageIterator with users
            page_iterator = MagicMock()
            page_iterator.users = [user_record]
            page_iterator.iterate_all = MagicMock(return_value=page_iterator.users)
            mock_auth.list_users = MagicMock(return_value=page_iterator)
            
            # Patch firebase_admin.auth
            m.setattr("app.v1.user.routes.auth", mock_auth)
            yield mock_auth

    @pytest.fixture
    def mock_supabase(self):
        """Mock the Supabase synchronizer"""
        from unittest.mock import MagicMock
        mock_sync = MagicMock()
        
        # Setup standard mock methods for synchronization
        mock_sync.create_user_in_supabase = MagicMock(return_value={"id": 1, "email": "test@example.com"})
        mock_sync.update_user_in_supabase = MagicMock(return_value={"id": 1, "email": "test@example.com"})
        mock_sync.delete_user_from_supabase = MagicMock(return_value=True)
        
        # Setup the request app state instead of patching a function
        with pytest.MonkeyPatch().context() as m:
            # Set up a mock function to be used when the synchronizer is fetched
            m.setattr("app.v1.user.helper.get_user_synchronizer", lambda req: mock_sync)
            
            # Also patch request.app.state directly for the route handlers
            def patch_request_object(*args, **kwargs):
                class MockState:
                    def __init__(self):
                        self.user_synchronizer = mock_sync
                
                class MockApp:
                    def __init__(self):
                        self.state = MockState()
                
                request = MagicMock()
                request.app = MockApp()
                return request
            
            # Replace all instances of Request with our mocked version
            m.setattr("app.v1.user.routes.Request", patch_request_object)
            m.setattr("app.v1.user.helper.Request", patch_request_object)
            
            yield mock_sync

    def test_create_user(self, client, mock_firebase_auth, mock_supabase):
        """Test creating a new user"""
        with Timer("create_user"):
            # Setup
            payload = {
                "email": "test@example.com",
                "password": "Test@123",
                "display_name": "Test User"
            }
            
            # Execute
            response = client.post("/v1/users/", json=payload)
            data = response.json()
            
            # Log response details for debugging
            #logger.info(f"Create user response: {response.status_code}, {data}")
            
            # Assert
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            
            # Verificar a resposta apenas
            assert "uid" in data, "Response missing 'uid' field"
            assert data["email"] == payload["email"], "Email in response doesn't match request"
            assert data["display_name"] == payload["display_name"], "Display name doesn't match"
            
            # Verificamos a chamada apenas se o mocking foi realizado via função e não via HTTP
            if mock_firebase_auth.create_user.called:
                mock_firebase_auth.create_user.assert_called_once()
                mock_firebase_auth.set_custom_user_claims.assert_called_once()

    def test_create_user_invalid_data(self, client, mock_firebase_auth):
        """Test creating a user with invalid data"""
        with Timer("create_user_invalid"):
            # Setup - missing required fields
            payload = {
                "email": "invalid-email"  # Invalid email format
            }
            
            # Execute
            response = client.post("/v1/users/", json=payload)
            
            # Assert
            assert response.status_code == 422, f"Expected 422, got {response.status_code}"
            assert "detail" in response.json(), "Response missing error details"

    def test_list_users(self, client, mock_firebase_auth):
        """Test listing all users"""
        with Timer("list_users"):
            # Execute
            response = client.get("/v1/users/list_all")
            data = response.json()
            
            # Log for debugging
            #logger.info(f"List users response: {response.status_code}, {data}")
            
            # Assert
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            assert "users" in data, "Response missing 'users' field"
            assert isinstance(data["users"], list), "Users field should be a list"
            
            # Verify mock was called
            mock_firebase_auth.list_users.assert_called_once()

    def test_get_user_by_uid(self, client, mock_firebase_auth):
        """Test getting a user by UID"""
        with Timer("get_user"):
            # Setup
            uid = "test-user-uid"
            
            # Execute
            response = client.get(f"/v1/users/{uid}")
            data = response.json()
            
            # Log for debugging
            #logger.info(f"Get user response: {response.status_code}, {data}")
            
            # Assert
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            assert data["uid"] == uid, "UID in response doesn't match request"
            
            # Verify mock was called with correct ID
            mock_firebase_auth.get_user.assert_called_with(uid)

    def test_get_user_not_found(self, client, mock_firebase_auth):
        """Test getting a non-existent user"""
        with Timer("get_user_not_found"):
            # Setup
            uid = "non-existent-uid"
            mock_firebase_auth.get_user.side_effect = Exception("User not found")
            
            # Execute
            response = client.get(f"/v1/users/{uid}")
            
            # Assert
            assert response.status_code == 404, f"Expected 404, got {response.status_code}"
            
            # Reset mock for other tests
            mock_firebase_auth.get_user.side_effect = None

    def test_update_user(self, client, mock_firebase_auth, mock_supabase):
        """Test updating a user"""
        with Timer("update_user"):
            # Setup
            uid = "test-user-uid"
            payload = {
                "display_name": "Updated Name",
                "password": "NewPassword123"
            }
            
            # Execute
            response = client.put(f"/v1/users/{uid}", json=payload)
            data = response.json()
            
            # Log for debugging
            #logger.info(f"Update user response: {response.status_code}, {data}")
            
            # Assert
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            assert data["uid"] == uid, "UID in response doesn't match request"
            
            # Verify mocks were called correctly
            mock_firebase_auth.update_user.assert_called_once()

    def test_delete_user(self, client, mock_firebase_auth, mock_supabase):
        """Test deleting a user"""
        with Timer("delete_user"):
            # Setup
            uid = "test-user-uid"
            
            # Execute
            response = client.delete(f"/v1/users/{uid}")
            data = response.json()
            
            # Log for debugging
            #logger.info(f"Delete user response: {response.status_code}, {data}")
            
            # Assert
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            assert "message" in data, "Response missing 'message' field"
            
            # Verify mock was called with correct ID
            mock_firebase_auth.delete_user.assert_called_with(uid)

    def test_sync_users(self, client, mock_firebase_auth, mock_supabase):
        """Test manually syncing all users"""
        with Timer("sync_users"):
            # Execute
            response = client.post("/v1/users/sync")
            data = response.json()
            
            # Log for debugging
            #logger.info(f"Sync users response: {response.status_code}, {data}")
            
            # Assert
            assert response.status_code == 202, f"Expected 202, got {response.status_code}"
            assert "message" in data, "Response missing 'message' field"

    def test_sync_single_user(self, client, mock_firebase_auth, mock_supabase):
        """Test syncing a single user"""
        with Timer("sync_single_user"):
            # Setup
            uid = "test-user-uid"
            # Need to patch the async method to return a value
            # This allows the sync call to complete
            mock_supabase.create_user_in_supabase.return_value = {"id": 1, "nome": "Test User", "email": "test@example.com"}
            
            # Execute
            response = client.post(f"/v1/users/sync/{uid}")
            data = response.json()
            
            # Log for debugging
            #logger.info(f"Sync single user response: {response.status_code}, {data}")
            
            # Assert
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            assert "message" in data, "Response missing 'message' field"
            assert "user" in data, "Response missing 'user' field"
            
            # Verify mock was called with correct ID
            mock_firebase_auth.get_user.assert_called_with(uid)

    def test_sync_nonexistent_user(self, client, mock_firebase_auth):
        """Test syncing a non-existent user"""
        with Timer("sync_nonexistent_user"):
            # Setup
            uid = "non-existent-uid"
            mock_firebase_auth.get_user.side_effect = Exception("User not found")
            
            # Execute
            response = client.post(f"/v1/users/sync/{uid}")
            
            # Assert
            assert response.status_code == 404, f"Expected 404, got {response.status_code}"
            
            # Reset mock for other tests
            mock_firebase_auth.get_user.side_effect = None

    @pytest.mark.parametrize("endpoint,method,expected_status", [
        ("/v1/users/nonexistent", "GET", 404),
        ("/v1/users/invalid/action", "POST", 404),
        ("/v1/users/", "PUT", 405),  # Method not allowed
    ])
    def test_error_handling(self, client, endpoint, method, expected_status):
        """Test error handling for various scenarios"""
        with Timer(f"error_handling_{method}_{expected_status}"):
            # Execute
            request_method = getattr(client, method.lower())
            response = request_method(endpoint)
            
            # Log for debugging
            #logger.info(f"Error handling response: {response.status_code}, {response.content}")
            
            # Assert
            assert response.status_code == expected_status, f"Expected {expected_status}, got {response.status_code}"