// src/runtime/overwatch-log.js

let overwatchLog = [];

function logOverwatch(message) {
  const entry = {
    timestamp: new Date().toISOString(),
    message
  };

  overwatchLog.push(entry);
  if (overwatchLog.length > 500) {
    overwatchLog = overwatchLog.slice(-500);
  }

  return entry;
}

function getOverwatchLog() {
  return overwatchLog;
}

module.exports = {
  logOverwatch,
  getOverwatchLog
};
