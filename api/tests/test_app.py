import pytest
from app.models.User import User
from unittest.mock import patch
from app import load_user


@pytest.fixture
def simulate_exception_route(app):
    with app.test_request_context():

        @app.route("/simulate-exception")
        def simulate_error():
            raise Exception("An error")

        yield


def test_handle_http_exception(client):
    response = client.get("/nonexistent-route")

    assert response.status_code == 404


@pytest.mark.usefixtures("simulate_exception_route")
def test_handle_general_exception(client):
    response = client.get("/simulate-exception")

    assert response.status_code == 500
    assert response.json == {"message": "Unexpected error"}


@pytest.mark.usefixtures("load_mock_data")
def test_load_user():
    test_username = "James"
    mock_user = User(username=test_username, password="password123")

    with patch("app.User.query.filter_by") as mock_filter_by:
        mock_filter_by.return_value.first.return_value = mock_user

        loaded_user = load_user(test_username)

        assert loaded_user == mock_user
