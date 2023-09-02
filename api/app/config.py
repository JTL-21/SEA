import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """
    Base configuration class for the Flask application.

    Defines the base configuration options that can be used to configure
    the Flask application. Subclasses can inherit from this class to provide different
    configuration sets for different environments.
    """

    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevConfig(Config):
    """
    Development configuration class.

    This class provides configuration options specifically tailored for the development environment.
    It inherits from the base Config class and extends it with additional settings.
    """

    DEBUG = True


class TestConfig(Config):
    """
    Test configuration class.

    This class provides configuration options for running tests. It inherits from the base Config class
    and overrides certain settings to ensure a suitable testing environment.
    """

    DEBUG = True
    TESTING = True
    LOGIN_DISABLED = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
