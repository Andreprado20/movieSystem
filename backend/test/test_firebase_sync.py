import pytest
import asyncio
import logging
from unittest.mock import patch, MagicMock, AsyncMock
from conftest import Timer
from app.auth.sync import UserSynchronizer, setup_firebase_auth_hooks

logger = logging.getLogger("test")

class TestFirebaseSync:
    """Test suite for Firebase-Supabase user synchronization"""

    @pytest.fixture
    def mock_supabase_client(self):
        """Mock Supabase client for testing"""
        mock_client = MagicMock()
        
        # Mock table method and chaining
        mock_table = MagicMock()
        mock_client.table.return_value = mock_table
        
        # Mock select, insert, update, delete methods and chaining
        mock_table.select.return_value = mock_table
        mock_table.insert.return_value = mock_table
        mock_table.update.return_value = mock_table
        mock_table.delete.return_value = mock_table
        mock_table.eq.return_value = mock_table
        
        # Mock execute method
        mock_execute = MagicMock()
        mock_table.execute.return_value = mock_execute
        
        # Sample data for different operations
        select_user_data = [{"id": 1, "nome": "Test User", "email": "test@example.com", "firebase_uid": "test-user-uid"}]
        select_empty_data = []
        insert_data = [{"id": 1, "nome": "New User", "email": "new@example.com", "firebase_uid": "new-user-uid"}]
        update_data = [{"id": 1, "nome": "Updated User", "email": "test@example.com", "firebase_uid": "test-user-uid"}]
        
        # Set up returns based on context
        def get_mock_data(operation):
            if operation == "select_existing":
                mock_execute.data = select_user_data
                return mock_execute
            elif operation == "select_empty":
                mock_execute.data = select_empty_data
                return mock_execute
            elif operation == "insert":
                mock_execute.data = insert_data
                return mock_execute
            elif operation == "update":
                mock_execute.data = update_data
                return mock_execute
            elif operation == "delete":
                mock_execute.data = []
                return mock_execute
        
        # Set up return values
        mock_execute.data = []  # Default empty
        
        # Mock auth admin methods
        mock_auth_admin = MagicMock()
        mock_client.auth.admin = mock_auth_admin
        
        # Mock user for list_users
        mock_user = MagicMock()
        mock_user.id = "supabase-user-id"
        mock_user.email = "test@example.com"
        mock_user.app_metadata = {"firebase_uid": "test-user-uid"}
        
        # Mock list_users method
        mock_users_response = MagicMock()
        mock_users_response.users = [mock_user]
        mock_auth_admin.list_users.return_value = mock_users_response
        
        # Mock create_user method
        mock_auth_admin.create_user.return_value = MagicMock(user=mock_user)
        
        # Mock delete_user method
        mock_auth_admin.delete_user.return_value = None
        
        yield mock_client, get_mock_data

    @pytest.fixture
    def mock_firebase_user(self):
        """Mock Firebase user record"""
        mock_user = MagicMock()
        mock_user.uid = "test-user-uid"
        mock_user.email = "test@example.com"
        mock_user.display_name = "Test User"
        mock_user.custom_claims = {"role": "authenticated"}
        yield mock_user

    @pytest.mark.asyncio
    async def test_create_user_in_supabase_new_user(self, mock_supabase_client, mock_firebase_user):
        """Test creating a new user in Supabase"""
        with Timer("create_user_new"):
            # Setup
            mock_client, get_mock_data = mock_supabase_client
            
            # Modifica o comportamento para garantir que _check_existing_user retorne None
            # Create a response with empty data for select
            empty_response = MagicMock()
            empty_response.data = []
            
            # Mock select to return no existing user, then insert to return new user
            mock_select = MagicMock()
            mock_eq = MagicMock()
            mock_select.eq = MagicMock(return_value=mock_eq)
            mock_eq.execute = MagicMock(return_value=empty_response)
            
            mock_table = MagicMock()
            mock_table.select = MagicMock(return_value=mock_select)
            
            # Mock the table method to return our custom mock
            table_returns = {}
            
            def get_table(name):
                if name not in table_returns:
                    if name == "Usuario":
                        # For _check_existing_user
                        table_returns[name] = mock_table
                    else:
                        table_returns[name] = MagicMock()
                return table_returns[name]
                
            mock_client.table = MagicMock(side_effect=get_table)
            
            # Mock insert to return a user
            mock_insert = MagicMock()
            mock_execute = MagicMock(return_value=get_mock_data("insert"))
            mock_insert.execute = mock_execute
            mock_table.insert = MagicMock(return_value=mock_insert)
            
            # Second call: create auth user
            mock_client.auth.admin.list_users = MagicMock(
                return_value=MagicMock(users=[])
            )
            
            # Setup auth.admin.create_user to return a mock user response
            auth_user_response = MagicMock()
            auth_user_response.user = MagicMock(id="auth-user-123")
            mock_client.auth.admin.create_user = MagicMock(return_value=auth_user_response)
            
            # Execute
            synchronizer = UserSynchronizer(mock_client)
            
            # Patch the _check_existing_user method to make sure it returns None
            with patch.object(synchronizer, '_check_existing_user', return_value=None):
                result = await synchronizer.create_user_in_supabase(mock_firebase_user)
            
            # Log for debugging
            #logger.info(f"Create user result: {result}")
            
            # Assert
            assert result is not False, "Function should not return False"
            assert mock_client.table.call_count >= 1, "Table method should be called at least once"
            assert mock_client.auth.admin.create_user.called, "Auth create_user should be called"

    @pytest.mark.asyncio
    async def test_create_user_in_supabase_existing_user(self, mock_supabase_client, mock_firebase_user):
        """Test handling an existing user in Supabase"""
        with Timer("create_user_existing"):
            # Setup
            mock_client, get_mock_data = mock_supabase_client
            
            # Mock select to return existing user
            mock_client.table().select().eq().execute = MagicMock(
                return_value=get_mock_data("select_existing")
            )
            
            # Execute
            synchronizer = UserSynchronizer(mock_client)
            result = await synchronizer.create_user_in_supabase(mock_firebase_user)
            
            # Log for debugging
            #logger.info(f"Create existing user result: {result}")
            
            # Assert
            assert result is not False, "Function should not return False"
            assert mock_client.table.call_count >= 1, "Table method should be called at least once"
            assert not mock_client.auth.admin.create_user.called, "Auth create_user should not be called for existing user"

    @pytest.mark.asyncio
    async def test_update_user_in_supabase(self, mock_supabase_client, mock_firebase_user):
        """Test updating a user in Supabase"""
        with Timer("update_user"):
            # Setup
            mock_client, get_mock_data = mock_supabase_client
            
            # Mock select to return existing user
            mock_client.table().select().eq().execute = MagicMock(
                return_value=get_mock_data("select_existing")
            )
            
            # Mock update to return updated user
            mock_client.table().update().eq().execute = MagicMock(
                return_value=get_mock_data("update")
            )
            
            # Execute
            synchronizer = UserSynchronizer(mock_client)
            result = await synchronizer.update_user_in_supabase(mock_firebase_user)
            
            # Log for debugging
            #logger.info(f"Update user result: {result}")
            
            # Assert
            assert result is not False, "Function should not return False"
            assert mock_client.table.call_count >= 2, "Table method should be called at least twice"
            assert mock_client.table().update.called, "Update method should be called"

    @pytest.mark.asyncio
    async def test_delete_user_from_supabase(self, mock_supabase_client):
        """Test deleting a user from Supabase"""
        with Timer("delete_user"):
            # Setup
            mock_client, get_mock_data = mock_supabase_client
            
            # Mock delete
            mock_client.table().delete().eq().execute = MagicMock(
                return_value=get_mock_data("delete")
            )
            
            # Execute
            synchronizer = UserSynchronizer(mock_client)
            result = await synchronizer.delete_user_from_supabase("test-user-uid")
            
            # Log for debugging
            #logger.info(f"Delete user result: {result}")
            
            # Assert
            assert result is True, "Function should return True"
            assert mock_client.table.call_count >= 1, "Table method should be called at least once"
            assert mock_client.table().delete.called, "Delete method should be called"

    def test_setup_firebase_auth_hooks(self, mock_supabase_client):
        """Test setting up Firebase auth hooks"""
        with Timer("setup_auth_hooks"):
            # Setup
            mock_client, _ = mock_supabase_client
            
            # Execute
            result = setup_firebase_auth_hooks(mock_client)
            
            # Assert
            assert result is not None, "Function should return a synchronizer instance"
            assert isinstance(result, UserSynchronizer), "Result should be a UserSynchronizer instance"

    @pytest.mark.asyncio
    @patch('app.auth.sync.auth')
    async def test_set_authenticated_role(self, mock_auth, mock_supabase_client, mock_firebase_user):
        """Test setting the authenticated role on a Firebase user"""
        with Timer("set_authenticated_role"):
            # Setup
            mock_client, get_mock_data = mock_supabase_client
            
            # Configure mock_auth to return something for set_custom_user_claims
            mock_auth.set_custom_user_claims = MagicMock()
            
            # Use o UserSynchronizer diretamente mas patche os métodos internos
            synchronizer = UserSynchronizer(mock_client)
            
            # Patch o método _check_existing_user para forçar o fluxo de criação de usuário
            with patch.object(synchronizer, '_check_existing_user', return_value=None), \
                 patch.object(synchronizer, '_get_or_create_supabase_auth_user'), \
                 patch.object(synchronizer, '_create_user_record', return_value={"id": 1, "nome": "Test User"}):
                
                # Execute
                result = await synchronizer.create_user_in_supabase(mock_firebase_user)
            
            # Assert
            assert result is not False, "Function should not return False"
            assert mock_auth.set_custom_user_claims.called, "set_custom_user_claims should be called"
            mock_auth.set_custom_user_claims.assert_called_with(
                mock_firebase_user.uid, {'role': 'authenticated'}
            )

    @pytest.mark.asyncio
    async def test_create_user_record_with_profile(self, mock_supabase_client, mock_firebase_user):
        """Test creating a user record with a profile"""
        with Timer("create_user_with_profile"):
            # Setup
            mock_client, get_mock_data = mock_supabase_client
            
            # Usar mocks simples que possamos verificar depois
            mock_client.table = MagicMock()
            
            # Mock para o fluxo completo
            usuario_mock = MagicMock()
            usuario_insert_mock = MagicMock()
            usuario_execute_mock = MagicMock()
            
            perfil_mock = MagicMock()
            perfil_insert_mock = MagicMock()
            perfil_execute_mock = MagicMock()
            
            # Configurar a chamada mock_client.table com retornos diferentes dependendo do argumento
            mock_client.table.side_effect = lambda table_name: usuario_mock if table_name == "Usuario" else perfil_mock
            
            # Configurar a cadeia de chamadas para Usuario
            usuario_mock.insert.return_value = usuario_insert_mock
            usuario_insert_mock.execute.return_value = MagicMock(
                data=[{
                    "id": 1, 
                    "nome": "Test User", 
                    "email": "test@example.com", 
                    "firebase_uid": "test-user-uid"
                }]
            )
            
            # Configurar a cadeia de chamadas para Perfil
            perfil_mock.insert.return_value = perfil_insert_mock
            perfil_insert_mock.execute.return_value = MagicMock(
                data=[{
                    "id": 1, 
                    "tipo": "usuario", 
                    "nome": "Test User", 
                    "usuario_id": 1,
                    "descricao": "Profile for Test User"
                }]
            )
            
            # Execute
            synchronizer = UserSynchronizer(mock_client)
            result = await synchronizer._create_user_record(mock_firebase_user, None)
            
            # Log for debugging
            #logger.info(f"Create user record result: {result}")
            
            # Assert
            assert result is not None, "Function should not return None"
            assert mock_client.table.call_count >= 2, "Table method should be called at least twice"
            
            # Verify table calls in order
            table_calls = [args[0] for args, _ in mock_client.table.call_args_list]
            assert len(table_calls) >= 2, "Should have at least 2 calls to table()"
            assert "Usuario" in table_calls[0], "First call should be to Usuario table"
            assert "Perfil" in table_calls[1], "Second call should be to Perfil table"
            
            # Verify other calls were made
            assert usuario_mock.insert.called, "Usuario table insert should be called"
            assert perfil_mock.insert.called, "Perfil table insert should be called" 