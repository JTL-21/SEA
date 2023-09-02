from typing import Union, List


def model_list_as_dict(model_list: List) -> List[dict]:
    return list(map(lambda model: model.as_dict(), model_list))
