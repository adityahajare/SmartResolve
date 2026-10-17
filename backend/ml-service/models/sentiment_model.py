from transformers import pipeline
from functools import lru_cache

# Lazy-load sentiment model
_sentiment_pipeline = None

def get_sentiment_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        print("Loading sentiment model...")
        _sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment-latest",
            truncation=True, max_length=512
        )
    return _sentiment_pipeline

PRIORITY_BOOST = {
    "furious": 30, "angry": 20, "frustrated": 10,
    "neutral": 0,  "satisfied": -5
}

def map_to_emotion(label: str, score: float) -> str:
    if label in ("NEGATIVE", "negative"):
        if score > 0.85: return "furious"
        if score > 0.65: return "angry"
        if score > 0.35: return "frustrated"
        return "neutral"
    if label in ("POSITIVE", "positive"):
        return "satisfied"
    return "neutral"

def analyze_sentiment(text: str) -> dict:
    try:
        pipe   = get_sentiment_pipeline()
        result = pipe(text[:512])[0]
        label  = result["label"]
        score  = result["score"]
        emotion = map_to_emotion(label, score)
        raw_score = -score if "NEG" in label.upper() else (score if "POS" in label.upper() else 0.0)
        return {
            "label":        emotion,
            "score":        round(raw_score, 3),
            "priorityBoost": PRIORITY_BOOST.get(emotion, 0)
        }
    except Exception as e:
        print(f"Sentiment error: {e}")
        return {"label": "neutral", "score": 0.0, "priorityBoost": 0}
