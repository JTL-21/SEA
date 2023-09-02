from datetime import datetime
from app.utils.list import model_list_as_dict
from app.models.User import User


def test_model_list_as_dict():
    now = datetime.now()

    new_user1 = User(username="bob", password="password123", created_at=now)
    new_user2 = User(username="sally", password="password123", created_at=now)

    dict_list = model_list_as_dict([new_user1, new_user2])

    assert type(dict_list) == list
    assert type(dict_list[0]) == dict
    assert len(dict_list) == 2
    assert dict_list[0]["username"] == new_user1.username
