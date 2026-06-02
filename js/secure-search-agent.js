module.exports = {
  async run({ query, engines }) {
    const usedEngines = engines && engines.length ? engines : ["duckduckgo"];

    return {
      agent: "secure_search",
      query,
      engines: usedEngines,
      privacy_model: {
        sends_cookies: false,
        embeds_third_party_js: false,
        logs_personal_identifiers: false
      },
      note: "Secure search agent wired. Ready for API integration."
    };
  }
};
