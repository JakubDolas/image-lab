import pytest
from app.domain.conversion.utils import normalize_format
import zipfile
from app.domain.conversion.utils import zip_many
from app.domain.conversion.utils import supported_formats

def test_normalize_format_aliases():
    assert normalize_format("jpg") == "jpeg"
    assert normalize_format(".JPG") == "jpeg"
    assert normalize_format("tif") == "tiff"

def test_normalize_format_ok():
    assert normalize_format("png") == "png"
    assert normalize_format("PNG") == "png"

def test_normalize_format_empty():
    import pytest
    with pytest.raises(ValueError):
        normalize_format("")

def test_normalize_format_invalid():
    import pytest
    with pytest.raises(ValueError):
        normalize_format("xxx")

def test_supported_formats_basic():
    fmts = supported_formats()

    assert isinstance(fmts, list)
    assert "png" in fmts
    assert "jpeg" in fmts
    assert all(f.islower() for f in fmts)

def test_zip_many_creates_valid_zip():
    files = [
        ("a.txt", b"AAA"),
        ("b.txt", b"BBB"),
    ]

    buf = zip_many(files)

    with zipfile.ZipFile(buf) as zf:
        names = zf.namelist()
        assert "a.txt" in names
        assert "b.txt" in names
        assert zf.read("a.txt") == b"AAA"
        assert zf.read("b.txt") == b"BBB"
