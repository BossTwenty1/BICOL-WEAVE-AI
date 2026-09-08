# Public Deployment

BICOL-WEAVE-AI uses Vercel for the React frontend and Render for the FastAPI backend. The backend runs CPU-only inference using the tracked MobileNetV2 checkpoint.

## Deployment order

1. Push the repository to GitHub.
2. Deploy the backend to Render.
3. Obtain the Render backend URL.
4. Deploy the frontend to Vercel with `VITE_API_BASE_URL` set to the Render backend URL.
5. Obtain the Vercel frontend URL.
6. Add the Vercel frontend URL to Render `CORS_ORIGINS`.
7. Redeploy or restart the Render service.
8. Test public health, model metadata, and end-to-end prediction.

The presenter only needs to open the public Vercel frontend URL after this sequence is complete.

## Render configuration

Create a Web Service from the repository with:

```text
Root Directory: backend
Build Command: pip install --upgrade pip && pip install --index-url https://download.pytorch.org/whl/cpu torch torchvision && pip install -r requirements.txt
Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

This deployment uses CPU inference. Render should use Python 3.11 from `backend/.python-version`.

Set this Render environment variable after the Vercel domain is known:

```text
CORS_ORIGINS=https://YOUR_VERCEL_DOMAIN
```

The backend also keeps the local development origins `http://localhost:5173` and `http://127.0.0.1:5173` enabled. `CORS_ORIGINS` accepts a comma-separated list when more than one production origin is needed.

The production model file is:

```text
backend/models/mobilenet_v2_best.pth
```

Only this checkpoint is explicitly tracked. Dataset directories, training outputs, `.env` files, and other model artifacts remain ignored.

## Vercel configuration

Import the same repository as a Vercel project with:

```text
Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

Set this Vercel environment variable for the production deployment:

```text
VITE_API_BASE_URL=https://RENDER_BACKEND_URL
```

Do not include a trailing slash in the backend URL. The frontend reads this value at build time and sends `/health` and `/predict` requests to the configured backend.

## Public verification

After both services deploy, open the Vercel URL and confirm:

- the classifier status changes to `AI service ready` after the Render service wakes;
- the frontend can load the backend health endpoint;
- `/model-info` is reachable through the Render URL;
- a real JPG, JPEG, PNG, or WEBP image returns a prediction;
- prediction values, class code, probabilities, and inference time are shown from the backend response;
- the browser console has no CORS or network errors.

Render cold starts can make the first health request take longer. The frontend shows `Connecting to AI service...` while checking, retries the health request every 10 seconds, and does not fabricate a result if the backend fails.
