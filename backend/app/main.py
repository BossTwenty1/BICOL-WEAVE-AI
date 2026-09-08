"""FastAPI entry point for the Bicol Weave AI API."""

from __future__ import annotations

import io
from typing import Any, Dict

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from .config import get_cors_origins
from .model import model_service


app = FastAPI(title="Bicol Weave AI API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

SUPPORTED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}


@app.get("/")
def read_root() -> Dict[str, str]:
    """Return basic API status information."""
    return {
        "name": "Bicol Weave AI API",
        "status": "running",
    }


@app.get("/health")
def read_health() -> Dict[str, Any]:
    """Return API and model health status."""
    return {
        "status": "ok",
        "model_loaded": True,
    }


@app.get("/model-info")
def read_model_info() -> Dict[str, Any]:
    """Return metadata for the loaded model checkpoint."""
    return model_service.metadata()


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> Dict[str, Any]:
    """Classify one uploaded woven coconut-leaf craft image."""
    if file.content_type not in SUPPORTED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail=(
                "Unsupported image type. Use JPEG, JPG, PNG, or WEBP."
            ),
        )

    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Uploaded image is empty.")
        with Image.open(io.BytesIO(file_bytes)) as image:
            return model_service.predict(image)
    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError) as error:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file could not be decoded as an image.",
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Image inference failed.",
        ) from error
    finally:
        await file.close()
