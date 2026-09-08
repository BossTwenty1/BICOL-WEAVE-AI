"""Application and model configuration constants."""

from pathlib import Path
import os
from typing import Dict, List


BASE_DIR: Path = Path(__file__).resolve().parents[1]
MODEL_PATH: Path = BASE_DIR / "models" / "mobilenet_v2_best.pth"

MODEL_NAME: str = "MobileNetV2"
CLASS_NAMES: List[str] = ["plain", "twill", "complex"]
CLASS_CODES: Dict[str, str] = {
    "plain": "S1",
    "twill": "S2",
    "complex": "S3",
}
IMAGE_SIZE: int = 224
DEFAULT_CORS_ORIGINS: List[str] = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


def get_cors_origins() -> List[str]:
    """Return local defaults plus comma-separated production origins."""
    configured_origins = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "").split(",")
        if origin.strip()
    ]
    if "*" in configured_origins:
        raise ValueError("CORS_ORIGINS must contain explicit origins, not '*'.")
    return list(dict.fromkeys(DEFAULT_CORS_ORIGINS + configured_origins))
