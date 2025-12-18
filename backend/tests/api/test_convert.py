from io import BytesIO
import json

def test_supported_formats(client, monkeypatch):
    def fake_supported_formats():
        return ["png", "jpeg", "webp"]

    monkeypatch.setattr(
        "app.api.routes.convert.supported_formats",
        fake_supported_formats
    )

    r = client.get("/convert/supported")

    assert r.status_code == 200
    data = r.json()

    assert data["formats"] == ["png", "jpeg", "webp"]
    assert data["preferred_ext"]["jpeg"] == "jpg"

def test_zip_simple_ok(client, monkeypatch):
    def fake_convert_single_image(**kwargs):
        return ("test.png", b"PNGDATA")

    def fake_zip_many(items):
        return BytesIO(b"ZIPDATA")

    monkeypatch.setattr(
        "app.api.routes.convert.convert_single_image",
        fake_convert_single_image
    )
    monkeypatch.setattr(
        "app.api.routes.convert.zip_many",
        fake_zip_many
    )

    files = [
        ("files", ("a.jpg", b"AAA", "image/jpeg")),
        ("files", ("b.jpg", b"BBB", "image/jpeg")),
    ]

    r = client.post(
        "/convert/zip-simple?target_format=png",
        files=files
    )

    assert r.status_code == 200
    assert r.headers["content-type"] == "application/zip"
    assert b"ZIPDATA" in r.content

def test_zip_simple_invalid_format(client, monkeypatch):
    def fake_normalize_format(fmt):
        raise ValueError("Nieobsługiwany format")

    monkeypatch.setattr(
        "app.api.routes.convert.normalize_format",
        fake_normalize_format
    )

    files = [
        ("files", ("a.jpg", b"AAA", "image/jpeg")),
    ]

    r = client.post(
        "/convert/zip-simple?target_format=xxx",
        files=files
    )

    assert r.status_code == 400
    assert "Nieobsługiwany format" in r.text


def test_zip_custom_ok(client, monkeypatch):
    def fake_convert_single_image(**kwargs):
        return ("out.png", b"DATA")

    def fake_zip_many(items):
        return BytesIO(b"ZIPDATA")

    monkeypatch.setattr(
        "app.api.routes.convert.convert_single_image",
        fake_convert_single_image
    )
    monkeypatch.setattr(
        "app.api.routes.convert.zip_many",
        fake_zip_many
    )

    options = [
        {"format": "png", "width": 100, "height": 100},
        {"format": "png", "width": None, "height": None},
    ]

    files = [
        ("files", ("a.jpg", b"AAA", "image/jpeg")),
        ("files", ("b.jpg", b"BBB", "image/jpeg")),
    ]

    r = client.post(
        "/convert/zip-custom",
        files=files,
        data={"options_json": json.dumps(options)}
    )

    assert r.status_code == 200
    assert r.headers["content-type"] == "application/zip"


def test_zip_custom_mismatch(client):
    files = [
        ("files", ("a.jpg", b"AAA", "image/jpeg")),
    ]

    options = []

    r = client.post(
        "/convert/zip-custom",
        files=files,
        data={"options_json": json.dumps(options)}
    )

    assert r.status_code == 400
    assert "Niezgodna liczba opcji" in r.text


def test_convert_to_editor_ok(client, monkeypatch):
    def fake_convert_single_image(**kwargs):
        return ("out.png", b"PNGDATA")

    monkeypatch.setattr(
        "app.api.routes.convert.convert_single_image",
        fake_convert_single_image
    )

    r = client.post(
        "/convert/to-editor",
        files={"file": ("a.jpg", b"AAA", "image/jpeg")}
    )

    assert r.status_code == 200
    assert r.headers["content-type"] == "image/png"
    assert b"PNGDATA" in r.content
