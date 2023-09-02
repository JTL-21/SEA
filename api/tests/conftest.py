import pytest
from app import create_app
from app.config import TestConfig
from app.extensions import db
from app.models import User
from mock import seed_db


@pytest.fixture
def app():
    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture(autouse=True)
def load_mock_data(app):
    with app.app_context():
        seed_db(db)


@pytest.fixture
def client(app):
    return app.test_client()
