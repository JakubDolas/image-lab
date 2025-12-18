from io import BytesIO
import numpy as np
from PIL import Image
from app.domain.edit.service import remove_background_bytes
from app.domain.edit.service import upscale_image_bytes

def test_remove_background_bytes(monkeypatch):
    called = {"ok": False}

    def fake_remove(data):
        called["ok"] = True
        return b"PNGDATA"

    monkeypatch.setattr(
        "app.domain.edit.service.remove",
        fake_remove
    )

    out = remove_background_bytes(b"FAKEIMAGE")

    assert isinstance(out, BytesIO)
    assert out.read() == b"PNGDATA"
    assert called["ok"] is True

def test_upscale_image_bytes_minimal(monkeypatch):
    # fake image input
    img = Image.new("RGB", (32, 32), (255, 0, 0))
    buf = BytesIO()
    img.save(buf, format="PNG")
    data = buf.getvalue()

    # fake ONNX output (1 tile, x4)
    fake_out = np.zeros((1, 3, 128 * 4, 128 * 4), dtype=np.float32)

    class FakeSession:
        def run(self, outputs, inputs):
            return [fake_out]

    monkeypatch.setattr(
        "app.domain.edit.service.session",
        FakeSession()
    )

    monkeypatch.setattr(
        "app.domain.edit.service.input_name",
        "in"
    )
    monkeypatch.setattr(
        "app.domain.edit.service.output_name",
        "out"
    )

    out = upscale_image_bytes(data)

    assert isinstance(out, BytesIO)

    img_out = Image.open(out)
    assert img_out.format == "PNG"
