class CriticAgent:
    """
    Critic Agent
    Evaluates CE output, improves structure, checks for errors.
    """

    def __init__(self, memory, bus):
        self.memory = memory
        self.bus = bus

    def process(self, ce_output: dict):
        improved = {
            "agent": "Critic",
            "intent": ce_output.get("intent"),
            "entities": ce_output.get("entities"),
            "analysis": self._improve(ce_output),
        }

        self.memory.save("critic_output", improved)
        return improved

    def _improve(self, ce_output):
        # placeholder logic — expand later
        return {
            "quality": "ok",
            "notes": "CE output validated and normalized."
        }
    class CriticAgent:
    """
    Critic Agent
    Validates CE output, checks data integrity, normalizes fields.
    """

    def __init__(self, memory, bus):
        self.memory = memory
        self.bus = bus

    def process(self, ce_output: dict):
        intent = ce_output.get("intent")
        data = ce_output.get("data", {})

        analysis = {
            "agent": "Critic",
            "intent": intent,
            "data_status": self._validate_data(data),
            "normalized": self._normalize(data)
        }

        self.memory.save("critic_output", analysis)
        return analysis

    def _validate_data(self, data):
        if not data:
            return "no_data_loaded"
        if "budget" in data and len(data["budget"]) == 0:
            return "empty_budget_file"
        if "transactions" in data and len(data["transactions"]) == 0:
            return "empty_transaction_file"
        return "ok"

    def _normalize(self, data):
        # Placeholder for future transformations
        return data
