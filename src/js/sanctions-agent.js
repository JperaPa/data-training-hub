module.exports = async function runSanctionsAgent() {
  return {
    alerts: [],
    listsChecked: []
  };
};

/*
UPGRADE PATH:
- Load OFAC, UN, EU sanctions lists
- Add fuzzy matching
- Add entity resolution
*/