def test_get_ticket(client):
    response = client.get("/api/ticket/EXO-1")

    assert response.status_code == 200
    assert response.json["slug"] == "EXO-1"


def test_get_nonexistent_ticket(client):
    response = client.get("/api/ticket/MOO-1")

    assert response.status_code == 404
