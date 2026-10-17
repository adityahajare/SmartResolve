from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

router = APIRouter(prefix="/forecast", tags=["Forecast"])
res_router = APIRouter(prefix="/resolution", tags=["Resolution"])

class ForecastRequest(BaseModel):
    ticketId: Optional[str] = None
    messagesCount: Optional[int] = 1
    sentimentScore: Optional[float] = 0.5
    hoursOpen: Optional[float] = 1.0
    escalationLevel: Optional[int] = 0
    repeatCount: Optional[int] = 0
    slaBreached: Optional[bool] = False

class ResolutionConfidenceRequest(BaseModel):
    complaintText: str
    resolutionText: str
    category: Optional[str] = "general"

@router.post("/frustration")
async def predict_frustration(req: ForecastRequest):
    # Rule-based frustration probability heuristic
    score = 0.2
    if req.sentimentScore < 0.3:
        score += 0.3
    if req.messagesCount > 3:
        score += 0.2
    if req.hoursOpen > 24:
        score += 0.15
    if req.slaBreached:
        score += 0.25
    if req.repeatCount > 1:
        score += 0.1

    prob = min(max(round(score, 2), 0.05), 0.98)
    action = "escalate" if prob > 0.75 else ("follow_up" if prob > 0.5 else "monitor")

    return {
        "frustrationProbability": prob,
        "predictedAction": action,
        "timeWindow": "2 hours" if prob > 0.7 else "6 hours",
        "recommendedAction": "Priority proactive outreach by manager" if prob > 0.7 else "Standard SLA monitoring"
    }

@res_router.post("/confidence")
async def evaluate_resolution(req: ResolutionConfidenceRequest):
    # Heuristic resolution quality scorer
    length = len(req.resolutionText.split())
    has_apology = any(w in req.resolutionText.lower() for w in ["sorry", "apologize", "regret"])
    has_steps = any(w in req.resolutionText.lower() for w in ["steps", "refund", "processed", "fixed", "resolved", "update"])

    score = 50
    if length > 20: score += 20
    if has_apology: score += 15
    if has_steps: score += 15

    score = min(score, 98)
    level = "High" if score >= 80 else ("Medium" if score >= 60 else "Low")

    return {
        "confidenceScore": score,
        "level": level,
        "suggestions": [] if score >= 80 else ["Include more concrete next steps or resolution details."],
        "improvedDraft": req.resolutionText if score >= 80 else f"{req.resolutionText}\n\nWe apologize for the inconvenience and have prioritized your issue."
    }
