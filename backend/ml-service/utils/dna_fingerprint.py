from datetime import datetime

CATEGORY_CODE = {
    "Payments & Billing":        "PAY",
    "Orders & Delivery":         "ORD",
    "Technical Issues":          "TECH",
    "Account & Profile":         "ACC",
    "Refunds & Returns":         "REF",
    "Documents & Verification":  "DOC",
    "Customer Service Quality":  "CS",
    "Other Issues":              "OTH"
}

AMOUNT_RANGE_MAP = [
    (50000, "VERY-HIGH"),
    (10000, "HIGH"),
    (5000,  "MID"),
    (1000,  "LOW"),
    (0,     "MINI")
]

def get_amount_range(amount) -> str:
    if not amount: return "NONE"
    for threshold, label in AMOUNT_RANGE_MAP:
        if amount > threshold: return label
    return "MINI"

def generate_fingerprint(category: str, entities: dict, metadata, sentiment: dict) -> str:
    cat_code  = CATEGORY_CODE.get(category, "OTH")
    pay_code  = (entities.get("paymentMethod") or "UNK").upper()[:3]

    hour = datetime.now().hour
    if   6  <= hour < 12: time_code = "MORN"
    elif 12 <= hour < 18: time_code = "AFT"
    elif 18 <= hour < 22: time_code = "EVN"
    else:                 time_code = "NGHT"

    amount_code  = get_amount_range(entities.get("amount"))
    sent_code    = (sentiment.get("label") or "neutral").upper()[:3]
    prev_count   = str(min(getattr(metadata, "repeatCount", 0) or 0, 9))

    return f"DNA-{cat_code}-{pay_code}-{time_code}-{amount_code}-{sent_code}-{prev_count}"
