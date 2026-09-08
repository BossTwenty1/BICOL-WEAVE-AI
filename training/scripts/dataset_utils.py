"""Reusable helpers for auditing and cleaning the weave image dataset."""

from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Iterable, Sequence

import pandas as pd


SUPPORTED_IMAGE_EXTENSIONS: frozenset[str] = frozenset(
    {".jpg", ".jpeg", ".png", ".webp"}
)


def sha256_file(file_path: Path, chunk_size: int = 1024 * 1024) -> str:
    """Return the SHA-256 digest for a file without loading it all at once."""
    digest = hashlib.sha256()
    with file_path.open("rb") as file_handle:
        for chunk in iter(lambda: file_handle.read(chunk_size), b""):
            digest.update(chunk)
    return digest.hexdigest()


def is_supported_image(file_path: Path) -> bool:
    """Return whether a path has a supported image extension."""
    return file_path.is_file() and file_path.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS


def build_dataset_manifest(
    dataset_root: Path,
    class_names: Sequence[str],
) -> pd.DataFrame:
    """Build a raw image manifest with file metadata and SHA-256 hashes."""
    rows: list[dict[str, object]] = []
    for class_name in class_names:
        class_dir = dataset_root / class_name
        if not class_dir.is_dir():
            raise FileNotFoundError(f"Missing dataset class directory: {class_dir}")
        for file_path in sorted(class_dir.rglob("*")):
            if is_supported_image(file_path):
                rows.append(
                    {
                        "filepath": str(file_path),
                        "filename": file_path.name,
                        "class_name": class_name,
                        "file_size": file_path.stat().st_size,
                        "sha256": sha256_file(file_path),
                    }
                )

    return pd.DataFrame(
        rows,
        columns=["filepath", "filename", "class_name", "file_size", "sha256"],
    )


def classify_duplicates(manifest: pd.DataFrame) -> pd.DataFrame:
    """Mark same-class duplicates and cross-class hash conflicts.

    One deterministic file is kept for a same-class duplicate group. Every
    occurrence is excluded when one hash appears under multiple classes.
    Source files are never deleted.
    """
    required_columns = {"filepath", "class_name", "sha256"}
    missing_columns = required_columns.difference(manifest.columns)
    if missing_columns:
        raise ValueError(f"Manifest is missing columns: {sorted(missing_columns)}")

    audited = manifest.copy()
    audited["status"] = "usable"
    audited["duplicate_group_size"] = audited.groupby("sha256")["sha256"].transform("size")

    for _, group in audited.groupby("sha256", sort=True):
        class_count = group["class_name"].nunique()
        if class_count > 1:
            audited.loc[group.index, "status"] = "excluded_cross_class_conflict"
            continue

        if len(group) > 1:
            keep_index = group.sort_values("filepath").index[0]
            duplicate_indexes = group.index.difference([keep_index])
            audited.loc[duplicate_indexes, "status"] = "excluded_same_class_duplicate"

    return audited
