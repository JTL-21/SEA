def validate_comment_text(text: str) -> (bool, str):
    if not (0 < len(text) <= 512):
        return (False, "Comment text must be of a length between 1 and 512")

    return (True, None)
