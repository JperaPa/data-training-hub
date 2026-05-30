module.exports = function generateForecast(bills, transactions = []) {
  // 1. Fixed monthly bills
  const fixedTotal = bills.reduce((sum, b) => {
    const amt = parseFloat((b.amount || "0").replace(/,/g, ""));
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  // 2. Variable spending (based on past transactions)
  const categories = {};
  for (const tx of transactions) {
    if (!categories[tx.category]) categories[tx.category] = [];
    categories[tx.category].push(tx.amount);
  }

  const variableForecast = Object.entries(categories).map(([cat, amounts]) => {
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    return { category: cat, forecast: avg };
  });

  const variableTotal = variableForecast.reduce((s, v) => s + v.forecast, 0);

  // 3. Income (placeholder for now)
  const projectedIncome = 0;

  // 4. Net cash flow
  const projectedNet = projectedIncome - (fixedTotal + variableTotal);

  return {
    fixedTotal,
    variableTotal,
    projectedIncome,
    projectedNet,
    variableForecast
  };
};