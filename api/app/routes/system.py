from flask import Blueprint

system_bp = Blueprint("system", __name__)


@system_bp.get("/status")
def get_status():
    return "OK"
