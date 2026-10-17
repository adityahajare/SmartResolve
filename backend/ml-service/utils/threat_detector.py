import re

THREAT_KEYWORDS = [
    "consumer forum", "legal action", "lawsuit", "court", "lawyer", "attorney",
    "nclt", "rbi", "police", "fir", "going viral", "twitter", "social media",
    "youtube", "news channel", "media", "defamation", "fraud", "chargeback",
    "dispute", "arbitration", "ombudsman", "escalate to higher authority"
]

DEADLINE_KEYWORDS = [
    "urgent", "urgently", "asap", "immediately", "right now", "today",
    "tonight", "this evening", "before tomorrow", "deadline", "flight",
    "tomorrow morning", "in the next hour", "within an hour", "in 2 hours",
    "tonight itself", "need it now", "can't wait", "time sensitive"
]

def check_threat_language(text: str) -> bool:
    text_lower = text.lower()
    return any(kw in text_lower for kw in THREAT_KEYWORDS)

def check_deadline_pressure(text: str) -> bool:
    text_lower = text.lower()
    return any(kw in text_lower for kw in DEADLINE_KEYWORDS)
