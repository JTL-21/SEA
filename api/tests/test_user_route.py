import json
from app.models.User import User


def test_query_users(client):
    username = "James"
    response = client.get("/api/user", query_string={"username": username})

    assert type(response.json) == list
    assert response.json[0]["username"] == "James"


def test_query_users_no_query(client):
    response = client.get("/api/user")

    assert response.status_code == 400


def test_get_user(client):
    response = client.get("/api/user/James")

    assert response.status_code == 200


def test_get_nonexistent_user(client):
    response = client.get("/api/user/I_DO_NOT_EXIST")

    assert response.status_code == 404


def test_logout(client):
    response = client.post("/api/logout")

    assert response.status_code == 204


def test_login(client):
    response = client.post(
        "/api/login", json={"username": "James", "password": "password123"}
    )

    assert response.status_code == 200
    assert response.json["username"] == "James"


def test_login_nonexistent_user(client):
    response = client.post(
        "/api/login", json={"username": "I_DO_NOT_EXIST", "password": "password123"}
    )

    assert response.status_code == 404


def test_login_nonexistent_wrong_password(client):
    response = client.post(
        "/api/login", json={"username": "James", "password": "WRONG_PASSWORD"}
    )

    assert response.status_code == 401


def test_create_user(client):
    response = client.post(
        "/api/user", json={"username": "TestUser", "password": "password123"}
    )

    assert response.json["username"] == "TestUser"


def test_create_user_username_conflict(client):
    response = client.post(
        "/api/user", json={"username": "James", "password": "password123"}
    )

    assert response.status_code == 409
