export async function runReview() {
  return window.api.invoke('overwatch:run-review');
}
export async function getTrajectory() {
  return window.api.invoke('trajectory:get');
}
export async function getHistory() {
  return window.api.invoke('overwatch:get-history');
}
export async function approveRecommendation({ id, approver, rationale }) {
  // call cybersecurity assessment first
  const assessment = await window.api.invoke('cybersecurity:assess', { id, actionSummary: rationale });
  if (!assessment.safeToProceed) {
    throw new Error('Cybersecurity assessment failed: ' + (assessment.issues || []).join(', '));
  }
  return window.api.invoke('recommendation:approve', { id, approver, rationale });
}
