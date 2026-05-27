class CEAgent:
    """
    CE Agent (Content Extractor)
    First-pass agent: extracts intent, key data, and task type.
    """

    def __init__(self, memory, bus):
        self.memory = memory
        self.bus = bus

    def process(self, user_input: str):
        output = {
            "agent": "CE",
            "input": user_input,
            "intent": self._detect_intent(user_input),
            "entities": self._extract_entities(user_input),
            "raw": user_input
        }

        self.memory.save("ce_output", output)
        return output

    def _detect_intent(self, text):
        if "budget" in text.lower():
            return "analyze_budget"
        if "transactions" in text.lower():
            return "analyze_transactions"
        return "general_request"

    def _extract_entities(self, text):
        # simple placeholder — you can expand later
        return {"keywords": text.split()}
        from data.ingest import load_budget_csv, load_transactions_csv

class CEAgent:
    """
    CE Agent (Content Extractor)
    Detects intent: budget analysis or transaction analysis.
    Loads raw data needed for the task.
    """

    def __init__(self, memory, bus):
        self.memory = memory
        self.bus = bus

    def process(self, user_input: str):
        intent = self._detect_intent(user_input)

        output = {
            "agent": "CE",
            "input": user_input,
            "intent": intent,
            "entities": self._extract_entities(user_input),
            "data": self._load_data(intent)
        }

        self.memory.save("ce_output", output)
        return output

    def _detect_intent(self, text):
        t = text.lower()
        if "budget" in t:
            return "analyze_budget"
        if "transaction" in t or "spending" in t:
            return "analyze_transactions"
        return "general_request"

    def _extract_entities(self, text):
        return {"keywords": text.split()}

    def _load_data(self, intent):
        if intent == "analyze_budget":
            return {"budget": load_budget_csv()}
        if intent == "analyze_transactions":
            return {"transactions": load_transactions_csv()}
        return {}
