def validate_project_key(key: str) -> (bool, str):
    if len(key) != 3:
        return (False, "Project key must be of length 3")
    if not key.isalpha():
        return (False, "Project key must only contain A-Z")

    return (True, None)


def validate_project_title(title: str) -> (bool, str):
    if not (0 < len(title) <= 64):
        return (False, "Project title must be of a length between 1 and 64")

    return (True, None)


def validate_project_description(description: str) -> (bool, str):
    if not (len(description) <= 512):
        return (False, "Project description must be of a length between 1 and 64")

    return (True, None)


def validate_create_project(key: str, title: str, description: str) -> (bool, str):
    key_valid, key_fail_reason = validate_project_key(key)

    if not key_valid:
        return (False, key_fail_reason)

    title_valid, title_fail_reason = validate_project_title(title)

    if not title_valid:
        return (False, title_fail_reason)

    if description:
        description_valid, description_fail_reason = validate_project_description(
            description
        )
        if not description_valid:
            return (False, description_fail_reason)

    return (True, None)
