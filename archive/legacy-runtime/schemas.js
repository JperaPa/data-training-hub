// src/runtime/schemas.js
const buildAgentResponse = ({ agent, action, input, ce, critic, alf, output, status = "ok" }) => ({
  agent,
  action,
  status,
  input,
  ce,      // CE evaluation
  critic,  // critic evaluation
  alf,     // ALF decision
  output,  // final payload
  timestamp: new Date().toISOString()
});

module.exports = { buildAgentResponse };