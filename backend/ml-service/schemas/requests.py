from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class Metadata(BaseModel):
    customerId: str = ""
    accountType: str = "standard"
    waitTimeHours: float = 0
    isRepeat: bool = False
    repeatCount: int = 0
    previousEscalations: int = 0
    slaHoursRemaining: float = 99

class AnalysisRequest(BaseModel):
    text: str
    metadata: Optional[Metadata] = Metadata()

class SentimentRequest(BaseModel):
    text: str

class ClassifyRequest(BaseModel):
    text: str

class KBSuggestRequest(BaseModel):
    text: str
    category: Optional[str] = ""

class ForecastRequest(BaseModel):
    hoursSinceLastResponse: float = 0
    sentimentTrend: float = 0
    previousEscalations: int = 0
    slaHoursRemaining: float = 99
    followUpCount: int = 0
    isRepeatComplaint: int = 0
    accountTypePremium: int = 0
    ticketAgeHours: float = 0

class ResolutionRequest(BaseModel):
    resolutionText: str
    ticketContext: Optional[Dict[str, Any]] = {}

class DNAMatchRequest(BaseModel):
    dnaPattern: str
    companyId: str
    timeWindowHours: int = 2
