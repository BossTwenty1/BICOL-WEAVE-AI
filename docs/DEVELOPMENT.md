# Development Plan

## Phase 1 — AI / Model — complete

### Phase 1 Step 1 — Project foundation — complete

The repository structure, MVP architecture, FastAPI foundation, configuration, and development guidance are in place.

### Phase 1 Step 2 — Dataset preparation and MobileNetV2 training pipeline — implemented, awaiting Colab execution

The self-contained Colab notebook now audits the Google Drive dataset, removes duplicate/conflicting files from the training manifest, creates a stratified split, trains MobileNetV2, saves the best checkpoint, and produces evaluation artifacts. No dataset or generated result is stored in Git.

### Phase 1 Step 3 — Model training — complete

The MobileNetV2 notebook was executed in Google Colab, producing real evaluation outputs and the checkpoint used by the backend. Research metrics should remain grounded in the generated result files.

## Phase 2 — Backend — complete

- Model loading — implemented and verified against the local checkpoint.
- Inference service — implemented with checkpoint-matched preprocessing and single-load model initialization.
- `GET /model-info` — implemented.
- `POST /predict` — implemented with upload validation and inference error handling.
- API verification — completed for startup, metadata, unsupported MIME, and invalid-image handling. A successful real-image prediction upload remains to be verified with a local sample.

## Phase 3 — Frontend — implemented

- React/Vite/Tailwind single-page interface — implemented.
- Responsive navigation and presentation sections — implemented.
- `/health` connection indicator — verified against the local backend.
- `/predict` upload integration — implemented with real response rendering and friendly failure handling.
- Research results and project context — added using the verified MobileNetV2 evaluation values.
- Production build — verified with `npm run build`.

Both the backend and frontend servers must be running for the live classifier demonstration.

## Phase 2 — Backend

Implement image validation and preprocessing, load the selected PyTorch model, and add the `/model-info` and `/predict` endpoints.

## Phase 3 — Frontend

Create the React, Vite, and Tailwind CSS interface for image upload and prediction-result display.

## Phase 4 — Integration

Connect the frontend to the FastAPI backend and verify end-to-end inference with representative images.

## Phase 5 — Presentation Readiness

Polish the user experience, document the final workflow, verify deployment behavior, and prepare a clear demonstration without fabricating research results.
