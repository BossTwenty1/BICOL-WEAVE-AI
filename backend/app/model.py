"""MobileNetV2 checkpoint loading and image inference service."""

from __future__ import annotations

import io
import time
from pathlib import Path
from typing import Any, Dict, List, Mapping, Optional

import torch
import torch.nn as nn
import torchvision
from PIL import Image
from torchvision import transforms

from .config import (
    CLASS_CODES,
    CLASS_NAMES,
    IMAGE_SIZE,
    MODEL_NAME,
    MODEL_PATH,
)


class ModelService:
    """Load the trained classifier once and provide reusable predictions."""

    def __init__(self, checkpoint_path: Path) -> None:
        self.checkpoint_path = checkpoint_path
        if not checkpoint_path.is_file():
            raise FileNotFoundError(
                f"Model checkpoint not found: {checkpoint_path}"
            )

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.checkpoint = self._load_checkpoint(checkpoint_path)
        self.class_names = self._read_class_names(self.checkpoint)
        self.class_to_idx = self._read_class_to_idx(self.checkpoint)
        self.image_size = self._read_positive_int(
            self.checkpoint.get("image_size"), IMAGE_SIZE
        )
        self.normalization_mean = self._read_float_list(
            self.checkpoint.get("normalization_mean"),
            [0.485, 0.456, 0.406],
            "normalization_mean",
        )
        self.normalization_std = self._read_float_list(
            self.checkpoint.get("normalization_std"),
            [0.229, 0.224, 0.225],
            "normalization_std",
        )
        self.checkpoint_epoch = self._read_optional_int(self.checkpoint.get("epoch"))
        self.checkpoint_accuracy = self._read_optional_float(
            self.checkpoint.get("accuracy")
        )
        self._validate_class_metadata()
        self.model = self._build_model()
        self.transform = transforms.Compose(
            [
                transforms.Resize(256),
                transforms.CenterCrop(self.image_size),
                transforms.ToTensor(),
                transforms.Normalize(
                    self.normalization_mean,
                    self.normalization_std,
                ),
            ]
        )

    @staticmethod
    def _load_checkpoint(checkpoint_path: Path) -> Dict[str, Any]:
        """Load a trusted local checkpoint across supported PyTorch versions."""
        try:
            checkpoint = torch.load(
                checkpoint_path,
                map_location="cpu",
                weights_only=True,
            )
        except TypeError:
            checkpoint = torch.load(checkpoint_path, map_location="cpu")

        if not isinstance(checkpoint, dict):
            raise ValueError("The model checkpoint must contain a dictionary.")
        if "model_state_dict" not in checkpoint:
            raise ValueError("The checkpoint is missing model_state_dict.")
        return checkpoint

    @staticmethod
    def _read_class_names(checkpoint: Mapping[str, Any]) -> List[str]:
        value = checkpoint.get("class_names", CLASS_NAMES)
        if not isinstance(value, (list, tuple)):
            raise ValueError("Checkpoint class_names must be a list.")
        return [str(class_name) for class_name in value]

    @staticmethod
    def _read_class_to_idx(checkpoint: Mapping[str, Any]) -> Dict[str, int]:
        value = checkpoint.get(
            "class_to_idx",
            {class_name: index for index, class_name in enumerate(CLASS_NAMES)},
        )
        if not isinstance(value, Mapping):
            raise ValueError("Checkpoint class_to_idx must be a mapping.")
        return {str(class_name): int(index) for class_name, index in value.items()}

    @staticmethod
    def _read_positive_int(value: Any, fallback: int) -> int:
        if value is None:
            return fallback
        parsed = int(value)
        if parsed <= 0:
            raise ValueError("Checkpoint image_size must be positive.")
        return parsed

    @staticmethod
    def _read_float_list(
        value: Any,
        fallback: List[float],
        field_name: str,
    ) -> List[float]:
        if value is None:
            return fallback
        if not isinstance(value, (list, tuple)) or len(value) != 3:
            raise ValueError(f"Checkpoint {field_name} must contain three values.")
        return [float(item) for item in value]

    @staticmethod
    def _read_optional_int(value: Any) -> Optional[int]:
        return None if value is None else int(value)

    @staticmethod
    def _read_optional_float(value: Any) -> Optional[float]:
        return None if value is None else float(value)

    def _validate_class_metadata(self) -> None:
        expected_names = list(CLASS_NAMES)
        expected_mapping = {
            class_name: index for index, class_name in enumerate(expected_names)
        }
        if self.class_names != expected_names:
            raise ValueError(
                "Checkpoint class order is incompatible with the API contract: "
                f"expected {expected_names}, got {self.class_names}"
            )
        if self.class_to_idx != expected_mapping:
            raise ValueError(
                "Checkpoint class_to_idx is incompatible with the API contract: "
                f"expected {expected_mapping}, got {self.class_to_idx}"
            )

    def _build_model(self) -> nn.Module:
        """Build MobileNetV2 without downloading ImageNet weights."""
        model = torchvision.models.mobilenet_v2(weights=None)
        input_features = model.classifier[-1].in_features
        model.classifier[-1] = nn.Linear(input_features, len(self.class_names))
        model.load_state_dict(self.checkpoint["model_state_dict"])
        model.to(self.device)
        model.eval()
        return model

    def _synchronize_cuda(self) -> None:
        if self.device.type == "cuda":
            torch.cuda.synchronize(self.device)

    def predict(self, image: Image.Image) -> Dict[str, Any]:
        """Run inference and return JSON-serializable prediction values."""
        image_rgb = image.convert("RGB")
        input_tensor = self.transform(image_rgb).unsqueeze(0).to(self.device)

        self._synchronize_cuda()
        start_time = time.perf_counter()
        with torch.inference_mode():
            logits = self.model(input_tensor)
            probability_tensor = torch.softmax(logits, dim=1)[0]
        self._synchronize_cuda()
        inference_ms = (time.perf_counter() - start_time) * 1000.0

        predicted_index = int(probability_tensor.argmax().item())
        prediction = self.class_names[predicted_index]
        probabilities = {
            class_name: float(probability_tensor[index].item())
            for index, class_name in enumerate(self.class_names)
        }
        return {
            "prediction": prediction,
            "class_code": CLASS_CODES[prediction],
            "confidence": probabilities[prediction],
            "probabilities": probabilities,
            "inference_ms": float(inference_ms),
        }

    def metadata(self) -> Dict[str, Any]:
        """Return model metadata suitable for the model-info endpoint."""
        return {
            "model": MODEL_NAME,
            "classes": list(self.class_names),
            "class_codes": {
                class_name: CLASS_CODES[class_name] for class_name in self.class_names
            },
            "input_size": self.image_size,
            "device": str(self.device),
            "checkpoint_epoch": self.checkpoint_epoch,
            "checkpoint_accuracy": self.checkpoint_accuracy,
        }


model_service = ModelService(MODEL_PATH)
