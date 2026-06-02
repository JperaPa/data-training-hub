// src/runtime/callLLM.js
async function callLLM(...messages) {
  // Minimal stub so the system runs.
  // You can later wire this to OpenAI, Azure, etc.
  return {
    role: "assistant",
    content: "Stubbed LLM response from callLLM()."
  };
}

module.exports = {
  callLLM
};