import pytest
from app.schemas.conversion import FileOptions
from pydantic import ValidationError

def test_file_options_valid_and_normalized():
    opt = FileOptions(
        width=100,
        height=200,
        quality=80,
        format="JPG"
    )

    assert opt.width == 100
    assert opt.height == 200
    assert opt.quality == 80
    assert opt.format == "jpeg"

def test_file_options_format_none():
    opt = FileOptions(
        width=100,
        format=None
    )

    assert opt.format is None

def test_file_options_invalid_format():
    with pytest.raises(ValidationError):
        FileOptions(format="XXX")

def test_file_options_quality_out_of_range():
    with pytest.raises(ValidationError):
        FileOptions(quality=200)

def test_file_options_invalid_dimensions():
    with pytest.raises(ValidationError):
        FileOptions(width=0)

    with pytest.raises(ValidationError):
        FileOptions(height=-10)
