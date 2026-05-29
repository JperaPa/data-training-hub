cat > scripts/run_review.js <<'EOF'
#!/usr/bin/env node
(async () => {
  try {
    const runCompliance = require('../src/js/overwatch-compliance');
    const res = await runCompliance();
    console.log('=== OVERWATCH SUMMARY ===');
    console.log('Timestamp:', res.timestamp);
    console.log('Compliance score:', res.consolidated?.complianceScore);
    console.log('Top corrective actions:', (res.consolidated?.correctiveActions || []).slice(0,5));
    console.log('Trajectory probability:', res.trajectory?.forecast?.probabilityMissionOnTrack);
    process.exit(0);
  } catch (e) {
    console.error('Run failed:', e && e.stack ? e.stack : e);
    process.exit(1);
  }
})();
EOF
chmod +x scripts/run_review.js