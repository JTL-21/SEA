import pytest
from app.models.Comment import Comment
from app.extensions import db


@pytest.mark.usefixtures("load_mock_data")
def test_get_ticket_comments(client):
    response = client.get("/api/ticket/EXO-1/comments")

    assert response.status_code == 200
    assert type(response.json) == list


@pytest.mark.usefixtures("load_mock_data")
def test_get_nonexistent_ticket_comment(client):
    response = client.get("/api/ticket/MOO-1/comments")

    assert response.status_code == 404


@pytest.mark.usefixtures("load_mock_data")
def test_create_comment(authenticated_client):
    test_data = {"text": "     New cool comment!"}

    response = authenticated_client.post("/api/ticket/EXO-1/comment", json=test_data)

    assert response.status_code == 200
    assert response.json["text"] == test_data["text"].strip()


@pytest.mark.usefixtures("load_mock_data")
def test_delete_comment(authenticated_client, now):
    new_comment = Comment(
        text="New comment text!",
        author="James",
        ticket_project="EXO",
        ticket_id=1,
        created_at=now,
    )
    db.session.add(new_comment)
    db.session.commit()

    response = authenticated_client.delete(f"/api/comment/{new_comment.id}")

    assert response.status_code == 204


@pytest.mark.usefixtures("load_mock_data")
def test_delete_nonexistent_comment(authenticated_client):
    response = authenticated_client.delete("/api/comment/-1")

    assert response.status_code == 404


@pytest.mark.usefixtures("load_mock_data")
def test_delete_comment_unauthorized(authenticated_client, now):
    new_comment = Comment(
        text="New comment text!",
        author="Emma",  # Different author
        ticket_project="EXO",
        ticket_id=1,
        created_at=now,
    )
    db.session.add(new_comment)
    db.session.commit()

    response = authenticated_client.delete(f"/api/comment/{new_comment.id}")

    assert response.status_code == 403
