export function renderLocalSafetyPanel(data) {
  document.getElementById("safety-score").textContent =
    data.local_safety_score ?? "--";

  document.getElementById("crime-trends").innerHTML = `
    <div class="risk-${data.crime_trends.risk_level.toLowerCase()}">
      ${data.crime_trends.notes}
    </div>
  `;

  document.getElementById("economic-pressure").innerHTML = `
    <div>Inflation Delta: ${data.economic_pressure.inflation_delta}</div>
    <div>Tax Delta: ${data.economic_pressure.tax_delta}</div>
    <div>${data.economic_pressure.notes}</div>
  `;

  document.getElementById("food-supply").innerHTML = `
    <div>High Demand Items:</div>
    <ul>
      ${data.food_supply.high_demand_items.map(i => `<li>${i}</li>`).join("")}
    </ul>
    <div>${data.food_supply.price_index_notes}</div>
  `;

  document.getElementById("weather-environment").innerHTML = `
    <div>Alerts:</div>
    <ul>
      ${data.weather_environment.alerts.map(a => `<li>${a}</li>`).join("")}
    </ul>
    <div>${data.weather_environment.notes}</div>
  `;

  document.getElementById("healthcare-trends").innerHTML = `
    <div>Trend: ${data.healthcare.hospitalization_trend}</div>
    <div>Comparison: ${data.healthcare.comparison}</div>
  `;

  const actions = document.getElementById("safety-actions");
  actions.innerHTML = "";
  data.recommended_actions.forEach(a => {
    const li = document.createElement("li");
    li.textContent = a;
    actions.appendChild(li);
  });
}
