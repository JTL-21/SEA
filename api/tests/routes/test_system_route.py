def test_status(client):
    response = client.get("/status")
    assert response.status_code == 200
    assert response.text == "OK"
