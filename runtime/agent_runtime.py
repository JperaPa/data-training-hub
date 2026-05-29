import sys
import os

# Add project root to Python path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(ROOT_DIR)

from runtime.message_bus import MessageBus
from runtime.memory_store import MemoryStore

from agents.ce_agent import CEAgent
from agents.critic_agent import CriticAgent
from agents.alf_agent import ALFAgent

from agents.steward_agent import StewardAgent
self.steward = StewardAgent(self.memory, self.bus)


class AgentRuntime:
    def __init__(self):
        self.memory = MemoryStore()
        self.bus = MessageBus()

        self.ce = CEAgent(self.memory, self.bus)
        self.critic = CriticAgent(self.memory, self.bus)
        self.alf = ALFAgent(self.memory, self.bus)

    def run(self, user_input: str):
        # Step 1 — CE Agent generates initial output
        ce_output = self.ce.process(user_input)
        self.bus.publish("ce_output", ce_output)

        # Step 2 — Critic Agent evaluates and improves
        critic_output = self.critic.process(ce_output)
        self.bus.publish("critic_output", critic_output)

        # Step 3 — ALF Agent finalizes and formats
        final_output = self.alf.process(critic_output)
        self.bus.publish("alf_output", final_output)

        # Store final output in memory
        self.memory.save("last_output", final_output)

        return final_output