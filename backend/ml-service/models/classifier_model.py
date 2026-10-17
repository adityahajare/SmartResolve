from transformers import pipeline

_classifier = None

CATEGORIES = [
    "Payments & Billing",
    "Orders & Delivery",
    "Technical Issues",
    "Account & Profile",
    "Refunds & Returns",
    "Documents & Verification",
    "Customer Service Quality",
    "Other Issues"
]

SUBCATEGORIES = {
    "Payments & Billing":         ["Payment Failed", "Duplicate Charge", "Incorrect Amount", "Subscription Issue"],
    "Orders & Delivery":          ["Not Delivered", "Wrong Item", "Damaged Item", "Delayed Delivery"],
    "Technical Issues":           ["App Crash", "Login Failure", "Website Down", "Data Loss"],
    "Account & Profile":          ["Account Locked", "Unauthorized Access", "Profile Update Failed", "Password Issue"],
    "Refunds & Returns":          ["Refund Pending", "Return Rejected", "Wrong Refund Amount"],
    "Documents & Verification":   ["KYC Failed", "Document Rejected", "Verification Stuck"],
    "Customer Service Quality":   ["No Response", "Rude Agent", "Misinformation", "Unresolved Issue"],
    "Other Issues":               ["General Query", "Feature Request", "Other"]
}

def get_classifier():
    global _classifier
    if _classifier is None:
        print("Loading zero-shot classifier...")
        _classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    return _classifier

def classify_complaint(text: str) -> dict:
    try:
        clf    = get_classifier()
        result = clf(text[:512], candidate_labels=CATEGORIES)
        predicted   = result["labels"][0]
        confidence  = round(result["scores"][0], 3)

        # Get subcategory
        subs = SUBCATEGORIES.get(predicted, ["Other"])
        sub_result  = clf(text[:512], candidate_labels=subs)
        subcategory = sub_result["labels"][0]

        return {"predicted": predicted, "subcategory": subcategory, "confidence": confidence}
    except Exception as e:
        print(f"Classification error: {e}")
        return {"predicted": "Other Issues", "subcategory": "Other", "confidence": 0.5}
