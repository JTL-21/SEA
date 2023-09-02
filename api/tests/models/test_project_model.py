import pytest
from app.models.Project import Project


@pytest.mark.usefixtures("load_mock_data")
def test_as_dict():
    project = Project.query.first()

    project_dict = project.as_dict()

    assert isinstance(project_dict, dict)


@pytest.mark.usefixtures("load_mock_data")
def test_count_project_tickets():
    project = Project.query.filter_by(key="EXO").first()

    ticket_count = project.get_tickets(operator="count")

    assert ticket_count == 16


@pytest.mark.usefixtures("load_mock_data")
def test_get_project_tickets():
    project = Project.query.filter_by(key="EXO").first()

    tickets = project.get_tickets()

    assert isinstance(tickets, list)
    assert tickets[0].project == "EXO"
