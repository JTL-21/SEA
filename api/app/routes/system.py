from flask import Blueprint, send_from_directory

system_bp = Blueprint("system", __name__)


@system_bp.get("/status")
def get_status():
    return "OK"


@system_bp.get("/static/<path>")
def static_route(path):
    return send_from_directory("static", path)
