# Architecture

## Planned MVP pipeline

```text
Browser
  → React frontend
  → FastAPI backend
  → MobileNetV2
  → Plain / Twill / Complex prediction
```

The browser will provide image upload and result presentation. The FastAPI backend will receive the image, prepare it for inference, call the deployed PyTorch MobileNetV2 model, and return the predicted class, class code, confidence, probability distribution, and inference time.

The MVP intentionally uses a simple frontend-to-backend flow without a database or authentication layer.
