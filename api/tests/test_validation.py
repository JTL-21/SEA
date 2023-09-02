import pytest
from flask import Flask
from app.validation.utils import validate_body


def test_valid_request():
    test_schema = {
        "type": "object",
        "properties": {"key": {"type": "string"}},
        "required": ["key"],
    }

    app = Flask(__name__)

    @app.post("/test")
    @validate_body(test_schema)
    def test_route():
        return "Success"

    with app.test_client() as test_client:
        response = test_client.post("/test", json={"key": "value"})
        assert response.status_code == 200


def test_invalid_request():
    test_schema = {
        "type": "object",
        "properties": {"key": {"type": "string"}},
        "required": ["key"],
    }

    app = Flask(__name__)

    @app.post("/test")
    @validate_body(test_schema)
    def test_route():
        return "Success"

    with app.test_client() as test_client:
        response = test_client.post("/test", json={"invalid_key": "value"})
        assert response.status_code == 400


def test_exception_handling(monkeypatch):
    test_schema = {
        "type": "object",
        "properties": {"key": {"type": "string"}},
        "required": ["key"],
    }

    app = Flask(__name__)

    @app.post("/test")
    @validate_body(test_schema)
    def test_route():
        return "Success"

    def mock_abort(status_code, message):
        raise Exception(message)

    monkeypatch.setattr("flask.abort", mock_abort)

    with app.test_request_context("/test", json={"invalid_key": "value"}):
        with pytest.raises(Exception) as exc_info:
            test_route()

        assert "'key' is a required property" in str(exc_info.value)


def test_custom_error_message():
    test_schema = {
        "type": "object",
        "error_message": "Custom error message",
        "properties": {"key": {"type": "string"}},
        "required": ["key"],
    }

    app = Flask(__name__)

    @app.route("/test", methods=["POST"])
    @validate_body(test_schema)
    def test_route():
        return "Success"

    with app.test_client() as test_client:
        response = test_client.post("/test", json={"invalid_key": "value"})

        assert response.status_code == 400
        assert "Custom error message" in str(response.data)
