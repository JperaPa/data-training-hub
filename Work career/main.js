ipcMain.handle('dth:run-ce', async () => {

  // -----------------------------
  // ZONE 1 — SYSTEM & READINESS
  // -----------------------------
  const system = await ipcMain.invoke('dth:system-diagnostics');
  const readiness = computeReadiness(system);
  const critical = readiness.criticalIssues.length > 0;

  // -----------------------------
  // ZONE 2 — INTELLIGENCE
  // -----------------------------
  let osint = null;
  if (!critical) {
    osint = await runOSINTAgent();
  }

  const sanctions = await runSanctionsAgent();
  const typology = await runTypologyAgent();
  const training = await runTrainingAgent();
  const finance = await runFinanceAgent();

  // -----------------------------
  // ZONE 3 — CE SYNTHESIS
  // -----------------------------
  return synthesizeCE({
    system,
    readiness,
    critical,
    osint,
    sanctions,
    typology,
    training,
    finance
  });
});
