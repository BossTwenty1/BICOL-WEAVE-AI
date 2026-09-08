# API

The API is served by FastAPI at `http://127.0.0.1:8000`.

## `GET /`

Returns basic API status:

```json
{
  "name": "Bicol Weave AI API",
  "status": "running"
}
```

## `GET /health`

Returns API and model health:

```json
{
  "status": "ok",
  "model_loaded": true
}
```

## `GET /model-info`

Returns metadata read from the loaded checkpoint where available:

```json
{
  "model": "MobileNetV2",
  "classes": ["plain", "twill", "complex"],
  "class_codes": {
    "plain": "S1",
    "twill": "S2",
    "complex": "S3"
  },
  "input_size": 224,
  "device": "cpu",
  "checkpoint_epoch": 0,
  "checkpoint_accuracy": 0.0
}
```

The numeric values are illustrative response shapes. The running API returns actual checkpoint metadata.

## `POST /predict`

Accepts one uploaded image using the multipart field name `file`. Supported content types are `image/jpeg`, `image/jpg`, `image/png`, and `image/webp`.

Successful responses contain:

```json
{
  "prediction": "twill",
  "class_code": "S2",
  "confidence": 0.0,
  "probabilities": {
    "plain": 0.0,
    "twill": 0.0,
    "complex": 0.0
  },
  "inference_ms": 0.0
}
```

Confidence and probabilities are decimal values from 0 to 1. The frontend can convert confidence to a percentage.

Error behavior:

- `400` — empty or undecodable image
- `415` — unsupported content type
- `500` — inference failure
