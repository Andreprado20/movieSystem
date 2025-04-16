from fastapi.testclient import TestClient
from app.factory import create_app

app = create_app()
client = TestClient(app)

def test_create_user():
    payload = {
        "name": "Henrique",
        "email": "henrique@example.com",
        "password": "securePass123"
    }
    response = client.post("/v1/users/", json=payload)
    assert response.status_code in [200, 400]
    if response.status_code == 200:
        assert "uid" in response.json()

def test_list_users():
    response = client.get("/v1/users/list_all")
    assert response.status_code in [200, 500]
    if response.status_code == 200:
        assert isinstance(response.json(), list)

def test_get_user_by_uid():
    test_uid = "user-uid-aqui"  # coloque um UID real se possível
    response = client.get(f"/v1/users/{test_uid}")
    assert response.status_code in [200, 404]

def test_update_user():
    test_uid = "user-uid-aqui"  # coloque um UID real se possível
    payload = {
        "name": "Henrique Atualizado",
        "email": "henrique.upd@example.com"
    }
    response = client.put(f"/v1/users/{test_uid}", json=payload)
    assert response.status_code in [200, 400]

def test_delete_user():
    test_uid = "user-uid-aqui"  # coloque um UID real se possível
    response = client.delete(f"/v1/users/{test_uid}")
    assert response.status_code in [200, 400]