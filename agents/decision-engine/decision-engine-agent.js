export async function runDecisionEngineTask(task) {
  return window.electronAPI.invoke("run-dth-task", { task });
}