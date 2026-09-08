# Bicol Weave AI

Bicol Weave AI is an AI-powered web application for classifying woven coconut-leaf craft images into three structural classes:

1. `plain` — S1 Plain
2. `twill` — S2 Twill
3. `complex` — S3 Complex

The planned website will let a user upload an image and receive the predicted class, class code, confidence percentage, probability distribution for all three classes, and inference time.

## Technology stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Python, FastAPI, PyTorch, Pillow
- Machine learning: PyTorch, torchvision, scikit-learn, NumPy, pandas, matplotlib
- Training environment: Google Colab

The initial deployed model is planned to be MobileNetV2 using PyTorch transfer learning. Research experiments may also include MobileNetV2, ResNet18, and PCA-SVM.

## High-level architecture

```text
Browser → React frontend → FastAPI backend → MobileNetV2 → class prediction
```

The MVP is intentionally simple: it has no database and no authentication. Model weights and datasets are not stored in Git.

## Development status

This repository contains the initial project foundation. The FastAPI service currently exposes `GET /` and `GET /health`. The React application, model training, model loading, `/model-info`, and `/predict` are planned for later phases.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/API.md](docs/API.md), and [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for more detail.
