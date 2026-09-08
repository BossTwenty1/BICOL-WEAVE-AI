# Backend

The backend is a FastAPI inference service for the trained MobileNetV2 woven coconut-leaf craft classifier. It loads `models/mobilenet_v2_best.pth` once when the application starts and keeps the model in evaluation mode.

## Setup

From the `backend` directory, create a virtual environment if one does not already exist:

```text
python -m venv .venv
```

Activate it and install dependencies:

```text
.venv\Scripts\activate
python -m pip install -r requirements.txt
```

The checkpoint must be available at:

```text
backend/models/mobilenet_v2_best.pth
```

It is ignored by Git and must never be committed.

## Run locally

From the `backend` directory:

```text
python -m uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`. Interactive documentation is available at `http://127.0.0.1:8000/docs`.

## Endpoints

- `GET /` — basic API status
- `GET /health` — API and model health
- `GET /model-info` — loaded model metadata and checkpoint metadata
- `POST /predict` — classify one JPEG, JPG, PNG, or WEBP upload

## Prediction response

`POST /predict` returns the model output in decimal form:

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

The numeric values above are placeholders showing the response shape only; the running API returns values calculated from the loaded checkpoint.
