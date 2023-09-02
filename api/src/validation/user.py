def validate_user_username(username: str) -> (bool, str):
    if not (0 < len(username) <= 32):
        return (False, "User username must be of a length between 1 and 32")

    return (True, None)
