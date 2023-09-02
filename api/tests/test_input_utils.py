from app.utils.input import item_getter, normalize_strings

getter_test_data = {
    "arg1": 5,
    "arg2": False,
    "arg3": "    leading space!",
    "arg4": {"arg5": 0.1},
}


def test_item_getter_multiple():
    getter = item_getter("arg1", "arg2", "arg3", "arg4", "missing_arg")

    arg1, arg2, arg3, arg4, missing_arg = getter(getter_test_data)

    assert arg1 == getter_test_data["arg1"]
    assert arg2 == getter_test_data["arg2"]
    assert arg3 == getter_test_data["arg3"].strip()
    assert arg4 == getter_test_data["arg4"]
    assert missing_arg == None


def test_item_getter_single():
    getter = item_getter("arg1")

    arg1 = getter(getter_test_data)

    assert arg1 == getter_test_data["arg1"]


def test_normalize_strings():
    test_data = {"x": "   5 False...^{}", "y": {"z": {"a": "0     "}, "b": False}}

    normalized = normalize_strings(test_data)

    assert normalized["x"] == "5 False...^{}"
    assert normalized["y"]["z"]["a"] == "0"
    assert normalized["y"]["b"] == False
