import sys
import os

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, request, jsonify
from runtime.agent_runtime import AgentRuntime

app = Flask(__name__)
runtime = AgentRuntime()

@app.post("/run")
def run_agent():
    data = request.json
    user_input = data.get("input", "")
    output = runtime.run(user_input)
    return jsonify(output)
