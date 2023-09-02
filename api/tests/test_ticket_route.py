import pytest


@pytest.mark.usefixtures("load_mock_data")
def test_get_ticket(client):
    response = client.get("/api/ticket/EXO-1")

    assert response.status_code == 200
    assert response.json["slug"] == "EXO-1"


@pytest.mark.usefixtures("load_mock_data")
def test_get_nonexistent_ticket(client):
    response = client.get("/api/ticket/MOO-1")

    assert response.status_code == 404


@pytest.mark.usefixtures("load_mock_data")
def test_edit_ticket(authenticated_client):
    test_data = {
        "title": "New Ticket Title",
        "description": "New Ticket Description",
        "status": "DONE",
        "priority": "VERY_HIGH",
        "points": 9,
        "assignee": "James",
    }

    response = authenticated_client.patch(
        "/api/ticket/EXO-1",
        json=test_data,
    )

    assert response.status_code == 200
    assert response.json["title"] == test_data["title"]
    assert response.json["description"] == test_data["description"]
    assert response.json["status"] == test_data["status"]
    assert response.json["priority"] == test_data["priority"]
    assert response.json["points"] == test_data["points"]
    assert response.json["assignee"]["username"] == test_data["assignee"]


@pytest.mark.usefixtures("load_mock_data")
def test_edit_ticket_nonexistent_assignee(authenticated_client):
    response = authenticated_client.patch(
        "/api/ticket/EXO-1",
        json={"assignee": "I_DO_NOT_EXIST"},
    )

    assert response.status_code == 404


@pytest.mark.usefixtures("load_mock_data")
def test_delete_ticket(authenticated_client):
    response = authenticated_client.delete("/api/ticket/EXO-1")
    response2 = authenticated_client.get("/api/ticket/EXO-1")

    assert response.status_code == 204
    assert response2.status_code == 404


@pytest.mark.usefixtures("load_mock_data")
def test_create_ticket(authenticated_client):
    test_data = {
        "project": "EXO",
        "title": "New Test Ticket!",
        "description": "A new ticket for **testing**",
        "priority": "LOW",
        "points": 2,
    }

    response = authenticated_client.post("/api/ticket", json=test_data)

    assert response.status_code == 200
    assert response.json["project"]["key"] == test_data["project"]
    assert response.json["title"] == test_data["title"]
    assert response.json["description"] == test_data["description"]
    assert response.json["priority"] == test_data["priority"]
    assert response.json["points"] == test_data["points"]


@pytest.mark.usefixtures("load_mock_data")
def test_create_ticket_nonexistent_project(authenticated_client):
    test_data = {"project": "MOO", "title": "New Test Ticket!"}

    response = authenticated_client.post("/api/ticket", json=test_data)

    assert response.status_code == 404


@pytest.mark.usefixtures("load_mock_data")
def test_get_project_tickets(client):
    response = client.get("/api/project/EXO/tickets")

    assert response.status_code == 200
    assert type(response.json) == list


@pytest.mark.usefixtures("load_mock_data")
def test_get_project_tickets_nonexistent_project(client):
    response = client.get("/api/project/MOO/tickets")

    assert response.status_code == 404
