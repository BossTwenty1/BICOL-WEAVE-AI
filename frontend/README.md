# Frontend

BICOL-WEAVE-AI’s presentation-ready React frontend is built with Vite and Tailwind CSS. It provides a single-page research prototype for uploading woven coconut-leaf craft images and displaying the real FastAPI classifier response.

## Setup

From the project root:

```text
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` or the Vite URL shown in the terminal.

The frontend reads the backend base URL from `VITE_API_BASE_URL`. The development value is stored in the local, Git-ignored `.env` file:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Use `.env.example` as the template for another environment.

## Run the full MVP

Both servers must be running for the live classifier to work.

Terminal 1 — backend:

```text
cd backend
python -m uvicorn app.main:app --reload
```

Terminal 2 — frontend:

```text
cd frontend
npm run dev
```

## Included sections

- Home and project introduction
- Live image classifier connected to `POST /predict`
- Plain, Twill, and Complex class descriptions
- Understandable preprocessing and MobileNetV2 pipeline
- Verified MobileNetV2 research results
- About and technology stack

The frontend never fabricates prediction results. If the backend is unavailable, it shows a friendly connection error instead.

## Presentation layout and motion

The desktop container expands to 1400px, with larger navigation, 16–18px body
copy, prominent classifier panels, and 36–48px research values. The mobile
navigation opens below 1150px so enlarged links have enough space.

Motion uses CSS keyframes and a single IntersectionObserver hook; no animation
dependency is installed. Section headings, process steps, class cards, research
cards, and technology cards reveal once as they enter the viewport. Decorative
hero movement, hover transitions, image preview entrance, and an indeterminate
scanning line support the live demonstration.

Result labels immediately show the actual API numbers. The SVG confidence ring
and probability bars animate from zero to those values without inventing progress
or intermediate predictions. Research values retain their exact displayed precision.
Reduced-motion preferences disable animation and smooth scrolling, including
when the preference changes while the page is open. Animations do not delay requests.

Verification for this polish pass: production build passed; browser layout checked
at 375, 768, 1366, 1440, and 1920px widths; backend status displayed “AI service
ready”; invalid-file handling and mobile menu navigation passed. A real image
was not available in the project for repeating the full prediction test.
