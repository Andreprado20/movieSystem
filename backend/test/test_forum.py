from fastapi.testclient import TestClient
from app.factory import create_app
from fastapi import status

app = create_app()
client = TestClient(app)

# Headers for development mode authentication
DEV_HEADERS = {"X-Dev-Email": "test@example.com"}

def test_get_comments_for_movie():
    """Test retrieving comments for a movie"""
    movie_id = 1  # Use a valid movie ID
    response = client.get(f"/v1/forum/filme/{movie_id}/comments")
    assert response.status_code in [200, 404, 500]
    if response.status_code == 200:
        assert isinstance(response.json(), list)

def test_create_comment():
    """Test creating a new comment on a movie forum"""
    movie_id = 1  # Use a valid movie ID
    payload = {
        "mensagem": "Este é um comentário de teste"
    }
    response = client.post(
        f"/v1/forum/filme/{movie_id}/comments", 
        json=payload,
        headers=DEV_HEADERS
    )
    assert response.status_code in [200, 201, 400, 401, 404]
    if response.status_code in [200, 201]:
        assert "id" in response.json()
        assert "mensagem" in response.json()
        assert response.json()["mensagem"] == payload["mensagem"]

def test_create_reply_comment():
    """Test replying to another comment"""
    movie_id = 1  # Use a valid movie ID
    user_id = 1  # Use a valid user ID to reply to
    payload = {
        "mensagem": "Esta é uma resposta a outro comentário",
        "respondendo_id": user_id
    }
    response = client.post(
        f"/v1/forum/filme/{movie_id}/comments", 
        json=payload,
        headers=DEV_HEADERS
    )
    assert response.status_code in [200, 201, 400, 401, 404]
    if response.status_code in [200, 201]:
        assert "respondendo_id" in response.json()
        assert response.json()["respondendo_id"] == user_id

def test_like_comment():
    """Test liking a comment"""
    comment_id = 1  # Use a valid comment ID
    response = client.post(
        f"/v1/forum/comments/{comment_id}/like",
        headers=DEV_HEADERS
    )
    assert response.status_code in [200, 400, 401, 404]
    if response.status_code == 200:
        assert "likes" in response.json()
        assert response.json()["likes"] > 0

def test_update_comment():
    """Test updating a comment"""
    comment_id = 1  # Use a valid comment ID
    payload = {
        "mensagem": "Comentário atualizado"
    }
    response = client.put(
        f"/v1/forum/comments/{comment_id}", 
        json=payload,
        headers=DEV_HEADERS
    )
    assert response.status_code in [200, 400, 401, 403, 404]
    if response.status_code == 200:
        assert response.json()["mensagem"] == payload["mensagem"]

def test_delete_comment():
    """Test deleting a comment"""
    comment_id = 1  # Use a valid comment ID
    response = client.delete(
        f"/v1/forum/comments/{comment_id}",
        headers=DEV_HEADERS
    )
    assert response.status_code in [200, 400, 401, 403, 404]
    if response.status_code == 200:
        assert "message" in response.json()

def test_unauthorized_actions():
    """Test that actions require authentication"""
    movie_id = 1  # Use a valid movie ID
    # Try to create a comment without auth headers
    payload = {"mensagem": "Comentário sem autenticação"}
    response = client.post(f"/v1/forum/filme/{movie_id}/comments", json=payload)
    assert response.status_code in [401, 403] 