from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/dna", tags=["DNA Fingerprint"])

class DNAMatchRequest(BaseModel):
    fingerprint: str
    existingFingerprints: Optional[List[str]] = []

@router.post("/match")
async def match_dna(req: DNAMatchRequest):
    # Match similarity between DNA fingerprints
    matches = []
    curr_parts = req.fingerprint.split("-")
    
    for fp in req.existingFingerprints:
        parts = fp.split("-")
        shared = sum(1 for a, b in zip(curr_parts, parts) if a == b)
        similarity = shared / max(len(curr_parts), len(parts), 1)
        if similarity >= 0.5:
            matches.append({"fingerprint": fp, "similarity": round(similarity, 2)})
            
    is_incident = len(matches) >= 3
    return {
        "matches": matches,
        "isIncident": is_incident,
        "clusterSize": len(matches) + 1,
        "clusterSeverity": "critical" if len(matches) > 5 else "high" if is_incident else "normal"
    }
