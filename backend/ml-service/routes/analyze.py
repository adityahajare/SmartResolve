from fastapi import APIRouter
from schemas.requests import AnalysisRequest
from models.sentiment_model  import analyze_sentiment
from models.classifier_model import classify_complaint
from utils.priority_scorer   import calculate_priority_score
from utils.entity_extractor  import extract_entities
from utils.threat_detector   import check_threat_language, check_deadline_pressure
from utils.dna_fingerprint   import generate_fingerprint

router = APIRouter()

def predict_urgency(text: str, signals: dict, metadata) -> str:
    text_lower = text.lower()
    if any(w in text_lower for w in ["fraud","unauthorized","hacked","stolen","scam"]): return "critical"
    if signals.get("monetaryAmount", 0) > 10000:   return "critical"
    if signals.get("hasThreatLanguage"):            return "high"
    if signals.get("hasDeadlinePressure"):          return "high"
    if getattr(metadata, "waitTimeHours", 0) > 72: return "high"
    if getattr(metadata, "isRepeat"):               return "high"
    if signals.get("monetaryAmount", 0) > 1000:    return "medium"
    return "medium"

def detect_complexity(text: str) -> tuple:
    """Returns (is_complex, sub_tasks[])"""
    indicators = [
        ("Payments & Billing",       ["payment","deduct","charge","refund","billing"]),
        ("Account & Profile",        ["account","locked","login","password","profile"]),
        ("Orders & Delivery",        ["order","delivery","shipped","courier","item"]),
        ("Customer Service Quality", ["agent","rude","behavior","disconnected","no response"]),
        ("Technical Issues",         ["crash","error","app","website","not working"]),
    ]
    text_lower = text.lower()
    matched = [(cat, kws) for cat, kws in indicators if any(k in text_lower for k in kws)]
    if len(matched) >= 2:
        return True, [{"issue": f"Issue related to {cat}", "category": cat} for cat, _ in matched]
    return False, []

@router.post("/")
async def full_analysis(request: AnalysisRequest):
    text = request.text
    meta = request.metadata

    sentiment  = analyze_sentiment(text)
    category   = classify_complaint(text)
    entities   = extract_entities(text)
    is_complex, sub_tasks = detect_complexity(text)

    signals = {
        "monetaryAmount":      entities.get("amount"),
        "hasThreatLanguage":   check_threat_language(text),
        "hasDeadlinePressure": check_deadline_pressure(text),
        "entities":            entities,
    }

    urgency = predict_urgency(text, signals, meta)
    score, level = calculate_priority_score(sentiment, urgency, category["predicted"], signals, meta)
    dna = generate_fingerprint(category["predicted"], entities, meta, sentiment)

    routing_hint = {
        "department": category["predicted"],
        "agentLevel": "senior" if level == "critical" else "mid" if level == "high" else "junior",
        "reason": f"Priority {level}, category {category['predicted']}"
    }

    return {
        "sentiment":            sentiment,
        "category":             category,
        "urgency":              urgency,
        "signals":              signals,
        "priorityScore":        score,
        "priorityLevel":        level,
        "dnaFingerprint":       dna,
        "kbSuggestions":        [],
        "isComplex":            is_complex,
        "subTaskBreakdown":     sub_tasks,
        "routingRecommendation": routing_hint
    }
