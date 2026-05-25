module.exports = async function runFinanceAgent() {
  return {
    netCashFlow: 0,
    income: [],
    expenses: [],
    alerts: []
  };
};

/*
UPGRADE PATH:
- Connect to bank CSV exports
- Parse transactions
- Detect patterns, anomalies, cash flow trends
*/