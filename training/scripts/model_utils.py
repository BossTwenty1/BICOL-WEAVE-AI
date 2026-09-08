"""Shared model constants for future training and backend reuse."""

from __future__ import annotations

from typing import Dict, List


CLASS_NAMES: List[str] = ["plain", "twill", "complex"]
CLASS_CODES: Dict[str, str] = {
    "plain": "S1",
    "twill": "S2",
    "complex": "S3",
}
IMAGE_SIZE: int = 224
IMAGENET_MEAN: List[float] = [0.485, 0.456, 0.406]
IMAGENET_STD: List[float] = [0.229, 0.224, 0.225]


def class_to_idx() -> Dict[str, int]:
    """Return the stable class mapping used by the model."""
    return {class_name: index for index, class_name in enumerate(CLASS_NAMES)}


def class_code(class_name: str) -> str:
    """Return the presentation code for a known structural class."""
    try:
        return CLASS_CODES[class_name]
    except KeyError as error:
        raise ValueError(f"Unknown class name: {class_name}") from error
