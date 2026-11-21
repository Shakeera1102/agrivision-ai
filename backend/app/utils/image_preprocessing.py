import io
from PIL import Image
from fastapi import HTTPException, UploadFile

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/jpg"}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

def validate_image_file(file: UploadFile, content: bytes) -> None:
    """Validate image extension, MIME type, and size."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename in upload.")

    filename_lower = file.filename.lower()
    has_valid_ext = any(filename_lower.endswith(ext) for ext in ALLOWED_EXTENSIONS)
    if not has_valid_ext:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file extension. Allowed formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    if file.content_type and file.content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid MIME type: {file.content_type}. Please upload a JPEG or PNG image."
        )

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum size limit of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB."
        )

def load_and_preprocess_image(content: bytes) -> Image.Image:
    """Decode raw image bytes into a PIL RGB Image."""
    try:
        image = Image.open(io.BytesIO(content))
        image = image.convert("RGB")
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to decode image file: {str(exc)}"
        )
    return image
