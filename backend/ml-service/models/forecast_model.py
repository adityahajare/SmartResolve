class ForecastModel:
    @staticmethod
    def predict_frustration_prob(features: dict) -> float:
        score = 0.2
        if features.get("sentiment_score", 0.5) < 0.3:
            score += 0.35
        if features.get("messages_count", 1) > 3:
            score += 0.25
        if features.get("sla_breached", False):
            score += 0.3
        return min(max(round(score, 2), 0.05), 0.98)

forecast_model = ForecastModel()
