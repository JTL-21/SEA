import pytest


@pytest.mark.usefixtures("load_mock_data")
def test_query_project(client):
    response = client.get("/api/project", query_string={"query": "EXO"})

    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 1
    assert response.json[0]["key"] == "EXO"


@pytest.mark.usefixtures("load_mock_data")
def test_get_project(client):
    response = client.get("/api/project/EXO")

    assert response.status_code == 200
    assert response.json["key"] == "EXO"


@pytest.mark.usefixtures("load_mock_data")
def test_get_nonexistent_project(client):
    response = client.get("/api/project/MOO")

    assert response.status_code == 404


@pytest.mark.usefixtures("load_mock_data")
def test_edit_project(authenticated_client):
    response = authenticated_client.patch(
        "/api/project/EXO",
        json={"title": "New Title!", "description": "New Description!"},
    )

    assert response.status_code == 200
    assert response.json["title"] == "New Title!"
    assert response.json["description"] == "New Description!"


@pytest.mark.usefixtures("load_mock_data")
def test_edit_nonexistent_project(authenticated_client):
    response = authenticated_client.patch(
        "/api/project/MOO",
        json={},
    )

    assert response.status_code == 404


@pytest.mark.usefixtures("load_mock_data")
def test_edit_project_unauthorized(authenticated_client):
    response = authenticated_client.patch(
        "/api/project/SHP",
        json={},
    )

    assert response.status_code == 403


@pytest.mark.usefixtures("load_mock_data")
def test_edit_project_no_description(authenticated_client):
    response = authenticated_client.patch(
        "/api/project/EXO",
        json={"title": "New Title!"},
    )

    assert response.status_code == 200


@pytest.mark.usefixtures("load_mock_data")
def test_delete_project(authenticated_client):
    response = authenticated_client.delete(
        "/api/project/EXO",
    )

    response2 = authenticated_client.get(
        "/api/project/EXO",
    )

    assert response.status_code == 204
    assert response2.status_code == 404


@pytest.mark.usefixtures("load_mock_data")
def test_delete_nonexistent_project(authenticated_client):
    response = authenticated_client.delete(
        "/api/project/MOO",
    )

    assert response.status_code == 404


@pytest.mark.usefixtures("load_mock_data")
def test_delete_project_unauthorized(authenticated_client):
    response = authenticated_client.delete(
        "/api/project/SHP",
    )

    assert response.status_code == 403


@pytest.mark.usefixtures("load_mock_data")
def test_create_project(authenticated_client):
    response = authenticated_client.post(
        "/api/project",
        json={
            "key": "TST",
            "title": "Test Project",
            "description": "Test Project Description",
        },
    )

    assert response.status_code == 200
    assert response.json["key"] == "TST"


@pytest.mark.usefixtures("load_mock_data")
def test_create_project_key_conflict(authenticated_client):
    response = authenticated_client.post(
        "/api/project",
        json={
            "key": "EXO",
            "title": "Project EXO",
            "description": "Test Project Description",
        },
    )

    assert response.status_code == 409
