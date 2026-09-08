"""Application and model configuration constants."""

from pathlib import Path
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
