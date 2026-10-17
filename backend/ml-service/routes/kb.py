from fastapi import APIRouter
from schemas.requests import KBSuggestRequest

router = APIRouter()

# Simple keyword-based KB matching (replace with embedding-based later)
MOCK_KB = [
    {"articleId": "KB-001", "title": "How to reset your password", "url": "/kb/001", "keywords": ["password","reset","forgot","login","locked"]},
    {"articleId": "KB-002", "title": "What to do if payment is deducted but order not placed", "url": "/kb/002", "keywords": ["payment","deducted","order","not placed","failed","upi"]},
    {"articleId": "KB-003", "title": "How to track your order", "url": "/kb/003", "keywords": ["track","order","delivery","status","where"]},
    {"articleId": "KB-004", "title": "How to request a refund", "url": "/kb/004", "keywords": ["refund","return","money back","cancel"]},
    {"articleId": "KB-005", "title": "How to update your profile", "url": "/kb/005", "keywords": ["profile","update","name","email","phone","address"]},
    {"articleId": "KB-006", "title": "App not working — troubleshooting guide", "url": "/kb/006", "keywords": ["app","crash","not working","slow","error","bug"]},
    {"articleId": "KB-007", "title": "KYC verification guide", "url": "/kb/007", "keywords": ["kyc","verification","document","rejected","aadhar","pan"]},
]

def match_kb(text: str, category: str = "") -> list:
    text_lower = text.lower()
    results = []
    for article in MOCK_KB:
        matches = sum(1 for kw in article["keywords"] if kw in text_lower)
        if matches > 0:
            confidence = min(matches / len(article["keywords"]), 1.0)
            results.append({**article, "confidence": round(confidence, 2)})
    results.sort(key=lambda x: x["confidence"], reverse=True)
    return results[:3]

@router.post("/suggest")
async def suggest_kb(request: KBSuggestRequest):
    suggestions = match_kb(request.text, request.category)
    return {"suggestions": suggestions, "autoReply": len(suggestions) > 0 and suggestions[0]["confidence"] > 0.6}
