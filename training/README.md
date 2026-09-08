# Training

This directory contains the Phase 1 MobileNetV2 training pipeline for the woven coconut-leaf craft image classifier. Training is designed for Google Colab and Google Drive; the dataset and generated artifacts are intentionally kept outside this repository.

## Dataset

The notebook expects the inherited dataset at:

```text
MyDrive/Coconut_Weave_Dataset/
├── plain/
├── twill/
└── complex/
```

It scans all `.jpg`, `.jpeg`, `.png`, and `.webp` files. Exact duplicates are identified with SHA-256. Same-class duplicates keep one deterministic copy; hashes appearing under multiple classes are excluded entirely because their labels conflict. Source files are never deleted.

The stable class order is:

1. `plain` — S1 Plain
2. `twill` — S2 Twill
3. `complex` — S3 Complex

## Model configuration

- Model: MobileNetV2 with default ImageNet pretrained weights
- Input: 224 × 224 RGB
- Batch size: 16
- Optimizer: Adam
- Learning rate: `1e-4`
- Loss: CrossEntropyLoss
- Epochs: 30
- First 5 epochs: classifier only
- Remaining epochs: full-model fine-tuning
- Split: stratified 80% train / 20% test with random seed 42

The notebook evaluates the holdout test split after each epoch for MVP monitoring. This is acceptable for the presentation MVP but is not ideal research methodology; a validation set or cross-validation should be used for the final research version.

## Notebook and outputs

Open `training/notebooks/train_mobilenetv2.ipynb` in Google Colab and run the cells from top to bottom. The notebook creates this Drive output directory automatically:

```text
MyDrive/BICOL-WEAVE-AI-OUTPUTS/
```

It writes:

- `dataset_manifest.csv`
- `dataset_split.csv`
- `mobilenet_v2_best.pth`
- `training_loss.png`
- `training_accuracy.png`
- `test_accuracy.png`
- `mobilenet_results.json`
- `classification_report.csv`
- `confusion_matrix.png`

No dataset, trained weights, or measured metrics are included in this repository. They will exist only after a real Colab execution.
