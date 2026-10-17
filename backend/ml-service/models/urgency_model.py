class UrgencyPredictor:
    @staticmethod
    def predict_urgency(text: str, metadata: dict = None) -> str:
        text_lower = text.lower()
        critical_words = ["fraud", "hacked", "stolen", "unauthorized", "urgent", "police", "fir", "rbi", "emergency"]
        high_words = ["failed", "stuck", "pending", "delayed", "wrong", "penalty", "interest", "deadline"]
        
        if any(w in text_lower for w in critical_words):
            return "critical"
        elif any(w in text_lower for w in high_words):
            return "high"
        return "medium"

urgency_predictor = UrgencyPredictor()
