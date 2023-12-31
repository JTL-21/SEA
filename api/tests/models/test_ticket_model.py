import pytest
from app.models.Ticket import Ticket
from werkzeug.exceptions import BadRequest, NotFound


@pytest.mark.usefixtures("load_mock_data")
def test_ticket_from_slug():
    test_ticket = Ticket.from_slug("EXO-1")
    assert test_ticket.project == "EXO"


@pytest.mark.usefixtures("load_mock_data")
def test_ticket_from_slug_bad_input():
    with pytest.raises(BadRequest) as http_error:
        Ticket.from_slug("Meow ^-^")


@pytest.mark.usefixtures("load_mock_data")
def test_ticket_from_slug_nonexistent_project():
    with pytest.raises(NotFound) as http_error:
        Ticket.from_slug("MOO-123")


@pytest.mark.usefixtures("load_mock_data")
def test_ticket_from_slug_nonexistent_ticket():
    with pytest.raises(NotFound) as http_error:
        Ticket.from_slug("EXO-123")


@pytest.mark.usefixtures("load_mock_data")
def test_get_comments():
    test_ticket = Ticket.from_slug("EXO-1")
    comments = test_ticket.get_comments()

    assert isinstance(comments, list)


@pytest.mark.usefixtures("load_mock_data")
def test_as_dict():
    test_ticket = Ticket.from_slug("EXO-1")

    ticket_dict = test_ticket.as_dict()

    assert isinstance(ticket_dict, dict)
    assert ticket_dict["project"]["key"] == "EXO"
    assert ticket_dict["slug"] == "EXO-1"
