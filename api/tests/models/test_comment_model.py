import pytest
from app.models.Comment import Comment


@pytest.mark.usefixtures("load_mock_data")
def test_as_dict():
    comment = Comment.query.first()

    comment_dict = comment.as_dict()

    assert isinstance(comment_dict, dict)
