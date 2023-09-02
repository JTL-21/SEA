import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevConfig(Config):
    DEBUG = True


class TestConfig(Config):
    DEBUG = True
    TESTING = True
    LOGIN_DISABLED = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
