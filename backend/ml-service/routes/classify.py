from fastapi import APIRouter
from schemas.requests import ClassifyRequest
from models.classifier_model import classify_complaint

router = APIRouter()

@router.post("/")
async def classify(request: ClassifyRequest):
    return classify_complaint(request.text)
