export function scoreRisk(classification) {
  const map = {
    "Regulatory Change": 3,
    "Enforcement Action": 4,
    "Sanctions Update": 5,
    "Illicit Finance Trend": 4,
    "Geopolitical Risk": 5,
    "Other": 1
  };

  return map[classification] || 1;
}
