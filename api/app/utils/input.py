def item_getter(*keys):
    """
    Returns a function that pulls keys from a dictionary
    Missing keys are returned as None

    If only getting one key, the value is returned individually not as a tuple
    """

    def getter(data_dict):
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


def normalize_strings(input_dict):
    """
    Recursively strip leading and trailing spaces from strings in a dict
    """

    for key, value in input_dict.items():
        if isinstance(value, str):
            input_dict[key] = value.strip()
        elif isinstance(value, dict):
            # Recurse
            normalize_strings(value)

    return input_dict
