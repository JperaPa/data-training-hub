// ------------------------------------------------------------
// DASHBOARD RENDERER
// ------------------------------------------------------------

export function renderDashboard(system) {
  let html = "";

  // Helper to create collapsible sections
  function section(title, contentHtml) {
    return `
      <div class="dashboard-section collapsible">
        <div class="collapsible-header">
          <h2>${title}</h2>
          <span class="toggle-icon">+</span>
        </div>
        <div class="collapsible-content" style="display:none;">
          ${contentHtml}
        </div>
      </div>
    `;
  }

  // ------------------------------------------------------------
  // SYSTEM OVERVIEW
  // ------------------------------------------------------------
  html += section(
    "System Overview",
    `
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Agents Loaded:</strong> CE, Finance, OSINT, Sanctions, Typology, Training, Overwatch</p>
    `
  );

  // ------------------------------------------------------------
  // CE AGENT
  // ------------------------------------------------------------
  html += section(
    "CE Agent",
    `
      <pre>${JSON.stringify(system.ce, null, 2)}</pre>
    `
  );

  // ------------------------------------------------------------
  // FINANCE AGENT
  // ------------------------------------------------------------
  html += section(
    "Finance Agent",
    `
      <p><strong>Net Cash Flow:</strong> $${system.finance?.netCashFlow ?? "N/A"}</p>
      <pre>${JSON.stringify(system.finance, null, 2)}</pre>
    `
  );

  // ------------------------------------------------------------
  // OSINT AGENT
  // ------------------------------------------------------------
  html += section(
    "OSINT Agent",
    `
      <pre>${JSON.stringify(system.osint, null, 2)}</pre>
    `
  );

  // ------------------------------------------------------------
  // SANCTIONS AGENT
  // ------------------------------------------------------------
  html += section(
    "Sanctions Agent",
    `
      <pre>${JSON.stringify(system.sanctions, null, 2)}</pre>
    `
  );

  // ------------------------------------------------------------
  // TYPOLOGY AGENT
  // ------------------------------------------------------------
  html += section(
    "Typology Agent",
    `
      <pre>${JSON.stringify(system.typology, null, 2)}</pre>
    `
  );

  // ------------------------------------------------------------
  // TRAINING AGENT
  // ------------------------------------------------------------
  html += section(
    "Training Agent",
    `
      <pre>${JSON.stringify(system.training, null, 2)}</pre>
    `
  );

  // ------------------------------------------------------------
  // OVERWATCH AGENT (Your new system supervisor)
  // ------------------------------------------------------------
  html += section(
    "Overwatch Agent",
    `
      <p><strong>Pipeline Health:</strong> ${system.overwatch?.audit?.pipeline_status ? JSON.stringify(system.overwatch.audit.pipeline_status) : "N/A"}</p>
      <p><strong>Agent Health:</strong> ${system.overwatch?.audit?.agent_health ? JSON.stringify(system.overwatch.audit.agent_health) : "N/A"}</p>
      <p><strong>Errors:</strong> ${system.overwatch?.audit?.errors?.length ? system.overwatch.audit.errors.join(", ") : "None"}</p>
      <p><strong>Pending Tasks:</strong> ${system.overwatch?.audit?.pending_tasks?.length ? system.overwatch.audit.pending_tasks.join(", ") : "None"}</p>
      <p><strong>Next Required Action:</strong> ${system.overwatch?.nextAction || "None"}</p>

      <h3>External AI Reviews</h3>
      <pre>${system.overwatch?.externalReviews ? JSON.stringify(system.overwatch.externalReviews, null, 2) : "No reviews yet."}</pre>
    `
  );

  // ------------------------------------------------------------
  // Inject HTML into dashboard container
  // ------------------------------------------------------------
  const container = document.getElementById("dashboard-root");
  container.innerHTML = html;

  // ------------------------------------------------------------
  // Enable collapsible behavior
  // ------------------------------------------------------------
  document.querySelectorAll(".collapsible-header").forEach(header => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector(".toggle-icon");

      if (content.style.display === "none") {
        content.style.display = "block";
        icon.textContent = "−";
      } else {
        content.style.display = "none";
        icon.textContent = "+";
      }
    });
  });
}
