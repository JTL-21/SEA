import pytest


@pytest.fixture(autouse=True)
def simulate_exception_route(app):
    with app.test_request_context():

        @app.route("/simulate-exception")
        def simulate_error():
            raise Exception("An error")

    yield


def test_handle_http_exception(client):
    response = client.get("/nonexistent-route")

    assert response.status_code == 404


def test_handle_general_exception(client):
    response = client.get("/simulate-exception")

    assert response.status_code == 500
    assert response.json == {"message": "Unexpected error"}
