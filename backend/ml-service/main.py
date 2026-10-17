from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routes import analyze, sentiment, classify, kb, forecast, ocr, stt, dna

app = FastAPI(
    title="SmartResolve AI Service",
    description="AI analysis engine for complaint management",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────
app.include_router(analyze.router,   prefix="/analyze",   tags=["Analysis"])
app.include_router(sentiment.router, prefix="/sentiment", tags=["Sentiment"])
app.include_router(classify.router,  prefix="/classify",  tags=["Classification"])
app.include_router(kb.router,        prefix="/kb",        tags=["Knowledge Base"])
app.include_router(forecast.router,  prefix="/forecast",  tags=["Forecast"])
app.include_router(forecast.res_router, prefix="/resolution", tags=["Resolution"])
app.include_router(ocr.router,       prefix="/ocr",       tags=["OCR"])
app.include_router(stt.router,       prefix="/stt",       tags=["Speech-to-Text"])
app.include_router(dna.router,       prefix="/dna",       tags=["DNA Fingerprint"])

@app.get("/health")
def health():
    return {"status": "OK", "service": "SmartResolve AI Service"}

@app.on_event("startup")
async def startup():
    print("🤖 SmartResolve AI Service starting...")
    # Models are loaded lazily on first request to avoid slow startup
    print("✅ AI Service ready on port", os.getenv("PORT", 8000))
