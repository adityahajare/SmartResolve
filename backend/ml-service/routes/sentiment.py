from fastapi import APIRouter
from schemas.requests import SentimentRequest
from models.sentiment_model import analyze_sentiment

router = APIRouter()

@router.post("/")
async def get_sentiment(request: SentimentRequest):
    return analyze_sentiment(request.text)
