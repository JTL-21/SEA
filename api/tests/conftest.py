import pytest
from datetime import datetime
from flask_login import login_user
from mock import seed_db
from app import create_app
from app.config import TestConfig
from app.extensions import db
from app.models import User
from app.utils.input import item_getter


@pytest.fixture
def app():
    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def load_mock_data(app):
    with app.app_context():
        seed_db(db)


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def now():
    return datetime.now()


@pytest.fixture
def authenticated_client(request, app, client, now):
    if hasattr(request, "param"):
        data = request.param
    else:
        data = {}

    username, password, is_admin = item_getter("username", "password", "is_admin")(data)

    test_user = User(
        username=username or "James",
        password=password or "password123",
        is_admin=is_admin or False,
        created_at=now,
    )

    with app.test_request_context():
        login_user(test_user)
        yield client
