import json


def test_get_user(client):
    response = client.get("/api/user/James")

    assert response.status_code == 200
