from io import BytesIO

def test_remove_bg_ok(client, monkeypatch):
    called = {"value": False}

    def fake_remove_bg(data: bytes):
        called["value"] = True
        return BytesIO(b"PNGDATA")

    monkeypatch.setattr(
        "app.api.routes.edit.remove_background_bytes",
        fake_remove_bg
    )

    r = client.post(
        "/edit/remove-bg",
        files={"file": ("test.jpg", b"FAKEIMAGE", "image/jpeg")}
    )

    assert r.status_code == 200
    assert r.headers["content-type"] == "image/png"
    assert b"PNGDATA" in r.content
    assert called["value"] is True


def test_upscale_ok(client, monkeypatch):
    called = {"value": False}

    def fake_upscale(data: bytes):
        called["value"] = True
        return BytesIO(b"UPSCALED")

    monkeypatch.setattr(
        "app.api.routes.edit.upscale_image_bytes",
        fake_upscale
    )

    r = client.post(
        "/edit/upscale",
        files={"file": ("test.jpg", b"FAKEIMAGE", "image/jpeg")}
    )

    assert r.status_code == 200
    assert r.headers["content-type"] == "image/png"
    assert b"UPSCALED" in r.content
    assert called["value"] is True
