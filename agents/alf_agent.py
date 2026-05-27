class ALFAgent:
    """
    ALF Agent (Action Logic Formatter)
    Final agent: formats output for dashboard or API.
    """

    def __init__(self, memory, bus):
        self.memory = memory
        self.bus = bus

    def process(self, critic_output: dict):
        final = {
            "agent": "ALF",
            "intent": critic_output.get("intent"),
            "entities": critic_output.get("entities"),
            "result": self._format_output(critic_output)
        }

        self.memory.save("alf_output", final)
        return final

    def _format_output(self, critic_output):
        return {
            "message": "Request processed successfully.",
            "details": critic_output
        }class ALFAgent:
    """
    ALF Agent (Action Logic Formatter)
    Produces final structured output for dashboard/API.
    """

    def __init__(self, memory, bus):
        self.memory = memory
        self.bus = bus

    def process(self, critic_output: dict):
        intent = critic_output.get("intent")

        if intent == "analyze_budget":
            result = self._format_budget(critic_output)
        elif intent == "analyze_transactions":
            result = self._format_transactions(critic_output)
        else:
            result = {"message": "General request processed."}

        final = {
            "agent": "ALF",
            "intent": intent,
            "result": result
        }

        self.memory.save("alf_output", final)
        return final

    def _format_budget(self, critic_output):
        data = critic_output["normalized"]["budget"]
        total = sum(item["amount"] for item in data)
        return {
            "summary": f"Budget contains {len(data)} items totaling ${total:.2f}",
            "items": data
        }

    def _format_transactions(self, critic_output):
        data = critic_output["normalized"]["transactions"]
        total = sum(item["amount"] for item in data)
        return {
            "summary": f"Transactions contain {len(data)} entries totaling ${total:.2f}",
            "items": data
        }
