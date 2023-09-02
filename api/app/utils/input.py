from typing import Union, Tuple, Dict, Any


def item_getter(*keys: Union[str, Tuple[str, ...]]) -> callable:
    """
    Create a function that extracts values from a dictionary based on specified keys.

    This function returns a function that takes a dictionary as input and extracts values
    from the dictionary using the provided keys. If a key is missing in the dictionary,
    its corresponding value in the returned result will be None. If only a single key is
    provided, the extracted value is returned individually; otherwise, a tuple of values is returned.

    Args:
        *keys (Union[str, Tuple[str, ...]]): One or more keys to extract from the dictionary.

    Returns:
        callable: A function that extracts values from a dictionary based on the provided keys.
    """

    def getter(data_dict: Dict[str, Any]) -> Union[Any, None, Tuple[Any, ...]]:
        values = []
        for key in keys:
            value = data_dict.get(key, None)
            if isinstance(value, str):
                # Strip leading and trailing spaces from strings
                value = value.strip()
            values.append(value)

        if len(values) == 1:
            return values[0]

        return tuple(values)

    return getter


def normalize_strings(input_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Recursively remove leading and trailing spaces from string values in a dictionary.

    This function traverses a dictionary recursively and strips leading and trailing spaces
    from string values. It returns the updated dictionary.

    Args:
        input_dict (Dict[str, Any]): The dictionary to be normalized.

    Returns:
        Dict[str, Any]: The dictionary with normalized string values.
    """

    for key, value in input_dict.items():
        if isinstance(value, str):
            input_dict[key] = value.strip()
        elif isinstance(value, dict):
            # Recurse
            normalize_strings(value)

    return input_dict
