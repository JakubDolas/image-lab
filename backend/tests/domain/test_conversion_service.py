from io import BytesIO
from PIL import Image
from app.domain.conversion.service import convert_single_image
import pytest

def make_image(fmt="PNG", size=(100, 100), mode="RGB"):
    img = Image.new(mode, size, color=(255, 0, 0))
    buf = BytesIO()
    img.save(buf, format=fmt)
    return buf.getvalue()

def test_convert_png_to_jpeg():
    data = make_image(fmt="PNG")

    name, out = convert_single_image(
        filename="test.png",
        data=data,
        target_format="jpeg"
    )

    assert name == "test.jpg"
    assert isinstance(out, bytes)
    assert len(out) > 0

def test_resize_keep_aspect_width():
    data = make_image(size=(200, 100))

    _, out = convert_single_image(
        filename="img.png",
        data=data,
        target_format="png",
        width=100
    )

    img = Image.open(BytesIO(out))
    assert img.size == (100, 50)

def test_resize_keep_aspect_height():
    data = make_image(size=(200, 100))

    _, out = convert_single_image(
        filename="img.png",
        data=data,
        target_format="png",
        height=50
    )

    img = Image.open(BytesIO(out))
    assert img.size == (100, 50)

def test_resize_exact():
    data = make_image(size=(200, 100))

    _, out = convert_single_image(
        filename="img.png",
        data=data,
        target_format="png",
        width=300,
        height=300
    )

    img = Image.open(BytesIO(out))
    assert img.size == (300, 300)

def test_quality_only_for_jpeg():
    data = make_image(fmt="PNG")

    _, out = convert_single_image(
        filename="img.png",
        data=data,
        target_format="jpeg",
        quality=10
    )

    assert len(out) > 0

def test_invalid_image_data():
    with pytest.raises(ValueError):
        convert_single_image(
            filename="bad.txt",
            data=b"NOT AN IMAGE",
            target_format="png"
        )

def test_unsupported_output_format():
    data = make_image()

    with pytest.raises(ValueError):
        convert_single_image(
            filename="img.png",
            data=data,
            target_format="xxx"
        )
