# Taleyport Dev Portal

Internal video creation portal with backend-handled Google authentication.

## Setup

1. Create `.env` with: `VITE_BACKEND_URL=http://localhost:5001`
2. Add your email to `../Dev_APIS/app_flask.py` line 47
3. Start backend: `cd ../Dev_APIS && python app_flask.py`
4. Start frontend: `npm run dev`

## Deploy

Update `.env.production` with your production backend URL.
