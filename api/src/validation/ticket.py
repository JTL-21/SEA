def validate_ticket_title(title: str) -> (bool, str):
    if not (0 < len(title) <= 64):
        return (False, "Ticket title must be of a length between 1 and 64")

    return (True, None)


def validate_ticket_description(description: str) -> (bool, str):
    if not (0 <= len(description) <= 512):
        return (False, "Ticket description must be of a length between 0 and 512")

    return (True, None)


def validate_create_ticket(title: str, description: str) -> (bool, str):
    title_valid, title_fail_reason = validate_ticket_title(title)

    if not title_valid:
        return (False, title_fail_reason)

    description_valid, description_fail_reason = validate_ticket_description(
        description
    )

    if not description_valid:
        return (False, description_fail_reason)

    return (True, None)
