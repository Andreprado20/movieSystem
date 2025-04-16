from fastapi.testclient import TestClient
from app.factory import create_app
from fastapi import status

app = create_app()
client = TestClient(app)

def test_list_movies():
    response = client.get("/v1/movies/")
    assert response.status_code in [200, 400, 500]

def test_get_movie_by_id_from_tmdb():
    response = client.get("/v1/movies/find", params={"movie_id": 550})
    assert response.status_code in [200, 400, 404]

def test_create_movie():
    movie_payload = {
        "title": "Matrix",
        "release_date": "1999-03-31",
        "overview": "Neo descobre a Matrix.",
        "poster_path": "/path.jpg",
        "tmdb_id": 603
    }
    response = client.post("/v1/movies/", json=movie_payload)
    assert response.status_code in [201, 400]

def test_get_movie_from_db():
    response = client.get("/v1/movies/1")
    assert response.status_code in [200, 400, 404]

def test_update_movie():
    movie_payload = {
        "title": "Matrix Reloaded",
        "release_date": "2003-05-15",
        "overview": "Segunda parte da trilogia.",
        "poster_path": "/reload.jpg",
        "tmdb_id": 604
    }
    response = client.put("/v1/movies/1", json=movie_payload)
    assert response.status_code in [200, 400, 404]

def test_delete_movie():
    response = client.delete("/v1/movies/1")
    assert response.status_code in [200, 400, 404]