from unittest.mock import patch


def test_static_route(client):
    with patch("app.routes.system.send_from_directory") as mock_send_from_directory:
        mock_send_from_directory.return_value = "Test File"

        response = client.get("/static/file.txt")

        assert response.status_code == 200
        assert response.text == "Test File"


def test_status(client):
    response = client.get("/status")
    assert response.status_code == 200
    assert response.text == "OK"
