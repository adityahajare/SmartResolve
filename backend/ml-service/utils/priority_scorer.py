# Priority Score Calculator
# Formula: base + sentiment + urgency + wait_time + account + threat + monetary + repeat + escalation + sla

CATEGORY_BASE = {
    "Payments & Billing":        40,
    "Technical Issues":          38,
    "Documents & Verification":  35,
    "Customer Service Quality":  35,
    "Account & Profile":         30,
    "Refunds & Returns":         28,
    "Orders & Delivery":         25,
    "Other Issues":              10
}

URGENCY_BOOST = {"critical": 40, "high": 25, "medium": 10, "low": 0}

def calculate_priority_score(sentiment: dict, urgency: str, category: str, signals: dict, metadata) -> tuple:
    score = 0

    # 1. Base score by category
    score += CATEGORY_BASE.get(category, 20)

    # 2. Sentiment boost
    score += sentiment.get("priorityBoost", 0)

    # 3. Urgency boost
    score += URGENCY_BOOST.get(urgency, 0)

    # 4. Wait time boost
    wait = getattr(metadata, "waitTimeHours", 0) or 0
    if   wait > 120: score += 30
    elif wait > 72:  score += 20
    elif wait > 48:  score += 15
    elif wait > 24:  score += 10
    elif wait > 8:   score += 5

    # 5. Account type
    if getattr(metadata, "accountType", "") == "premium": score += 15

    # 6. Threat language
    if signals.get("hasThreatLanguage"):     score += 25

    # 7. Deadline pressure
    if signals.get("hasDeadlinePressure"):   score += 15

    # 8. Monetary amount
    amount = signals.get("monetaryAmount") or 0
    if   amount > 10000: score += 15
    elif amount > 5000:  score += 8
    elif amount > 1000:  score += 3

    # 9. Repeat complaint
    repeat_count = getattr(metadata, "repeatCount", 0) or 0
    if   repeat_count >= 3: score += 20
    elif repeat_count >= 1: score += 10

    # 10. Previous escalations
    prev_esc = getattr(metadata, "previousEscalations", 0) or 0
    score += min(prev_esc * 8, 24)

    # 11. SLA imminent
    sla_hrs = getattr(metadata, "slaHoursRemaining", 99) or 99
    if sla_hrs < 4: score += 30

    # Cap at 100
    score = min(int(score), 100)

    level = (
        "critical" if score >= 90 else
        "high"     if score >= 65 else
        "medium"   if score >= 35 else
        "low"
    )

    return score, level
