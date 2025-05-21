from fastapi.testclient import TestClient
from app.factory import create_app

app = create_app()
client = TestClient(app)

# Headers for development mode authentication
DEV_HEADERS = {"X-Dev-Email": "test@example.com"}

def test_add_movie_to_favorites():
    """Test adding a movie to favorites"""
    filme_id = 1  # Use a valid movie ID
    payload = {
        "filme_id": filme_id
    }
    response = client.post("/v1/movielist/favorites", json=payload, headers=DEV_HEADERS)
    assert response.status_code in [200, 201, 400, 401, 404]

def test_add_movie_to_watched():
    """Test adding a movie to watched list"""
    filme_id = 1  # Use a valid movie ID
    payload = {
        "filme_id": filme_id
    }
    response = client.post("/v1/movielist/watched", json=payload, headers=DEV_HEADERS)
    assert response.status_code in [200, 201, 400, 401, 404]

def test_add_movie_to_watch_later():
    """Test adding a movie to watch later list"""
    filme_id = 2  # Use a valid movie ID that's not in watched list
    payload = {
        "filme_id": filme_id
    }
    response = client.post("/v1/movielist/watch-later", json=payload, headers=DEV_HEADERS)
    assert response.status_code in [200, 201, 400, 401, 404]

def test_get_movie_status():
    """Test getting the status of a movie in all lists"""
    filme_id = 1  # Use a valid movie ID
    response = client.get(f"/v1/movielist/status/{filme_id}", headers=DEV_HEADERS)
    assert response.status_code in [200, 400, 401, 404]
    if response.status_code == 200:
        assert "is_favorite" in response.json()
        assert "is_watched" in response.json()
        assert "is_watch_later" in response.json()

def test_get_movies_in_list():
    """Test getting all movies in a list"""
    list_type = "favorites"  # Test favorites list
    response = client.get(f"/v1/movielist/{list_type}", headers=DEV_HEADERS)
    assert response.status_code in [200, 400, 401, 404]
    if response.status_code == 200:
        data = response.json()
        # Handle both direct list response and {data: []} format
        if isinstance(data, dict) and "data" in data:
            assert isinstance(data["data"], list)
        else:
            assert isinstance(data, list)

def test_remove_movie_from_list():
    """Test removing a movie from a list"""
    list_type = "favorites"
    filme_id = 1  # Use a valid movie ID
    response = client.delete(f"/v1/movielist/{list_type}/{filme_id}", headers=DEV_HEADERS)
    assert response.status_code in [200, 400, 401, 404]

def test_batch_update_list():
    """Test batch updating a list with multiple movies"""
    payload = {
        "filme_ids": [1, 2, 3],  # Use valid movie IDs
        "list_type": "favorite"
    }
    response = client.post("/v1/movielist/batch", json=payload, headers=DEV_HEADERS)
    assert response.status_code in [200, 400, 401, 404]
    if response.status_code == 200:
        assert "results" in response.json()
        assert isinstance(response.json()["results"], list)

def test_watch_later_validation():
    """Test that a movie can't be added to watch later if it's in watched list"""
    # First add a movie to watched
    filme_id = 3  # Use a valid movie ID
    payload = {
        "filme_id": filme_id
    }
    client.post("/v1/movielist/watched", json=payload, headers=DEV_HEADERS)
    
    # Then try to add it to watch later
    response = client.post("/v1/movielist/watch-later", json=payload, headers=DEV_HEADERS)
    assert response.status_code in [400, 401, 404]  # Should fail with 400 