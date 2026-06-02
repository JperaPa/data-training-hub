export async function runLocalSafetyTask(task) {
  return window.electronAPI.invoke("run-dth-task", { task });
}

export function renderLocalSafetyPanel(data) {
  // Safety Score
  document.getElementById("safety-score").textContent =
    data.local_safety_score ?? "--";

  // Crime Trends
  document.getElementById("crime-trends").innerHTML = `
    <div class="risk-${data.crime_trends.risk_level.toLowerCase()}">
      ${data.crime_trends.notes}
    </div>
  `;

  // Economic Pressure
  document.getElementById("economic-pressure").innerHTML = `
    <div>Inflation Delta: ${data.economic_pressure.inflation_delta}</div>
    <div>Tax Delta: ${data.economic_pressure.tax_delta}</div>
    <div>${data.economic_pressure.notes}</div>
  `;

  // Food Supply
  document.getElementById("food-supply").innerHTML = `
    <div>High Demand Items:</div>
    <ul>
      ${data.food_supply.high_demand_items
        .map(item => `<li>${item}</li>`)
        .join("")}
    </ul>
    <div>${data.food_supply.price_index_notes}</div>
  `;

  // Weather & Environment
  document.getElementById("weather-environment").innerHTML = `
    <div>Alerts:</div>
    <ul>
      ${data.weather_environment.alerts
        .map(a => `<li>${a}</li>`)
        .join("")}
    </ul>
    <div>${data.weather_environment.notes}</div>
  `;

  // Healthcare
  document.getElementById("healthcare-trends").innerHTML = `
    <div>Trend: ${data.healthcare.hospitalization_trend}</div>
    <div>Comparison: ${data.healthcare.comparison}</div>
  `;

  // Recommended Actions
  const actions = document.getElementById("safety-actions");
  actions.innerHTML = "";
  data.recommended_actions.forEach(a => {
    const li = document.createElement("li");
    li.textContent = a;
    actions.appendChild(li);
  });
}
