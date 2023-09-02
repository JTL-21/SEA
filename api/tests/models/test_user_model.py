from app.models.User import User


def test_hash_password():
    hashed_password = User.hash_password("password123")

    assert isinstance(hashed_password, str)


def test_verify_password():
    test_password = "password123"
    hashed_test_password = User.hash_password(test_password)

    new_user = User(username="bob", password=hashed_test_password)

    assert new_user.verify_password(test_password)
    assert not new_user.verify_password("NOT THE REAL PASSWORD")


def test_get_id():
    new_user = User(username="bob", password="")

    assert new_user.get_id() == "bob"
