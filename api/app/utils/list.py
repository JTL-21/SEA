from typing import List


def model_list_as_dict(model_list: List) -> List[dict]:
    """
    Convert a list of model objects to a list of dictionaries.

    This function takes a list of model objects and converts each object to a dictionary representation
    using the `as_dict()` method of the model. The resulting list of dictionaries is returned.
    Intended to be used to send JSON to the client.

    Args:
        model_list (List): A list of model objects.

    Returns:
        List[dict]: A list of dictionaries, each representing a model object.
    """

    return list(map(lambda model: model.as_dict(), model_list))
