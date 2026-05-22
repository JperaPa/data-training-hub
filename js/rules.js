// rules.js
export const RULES = {
    version: "1.0",

    evaluation: {
        relevanceWeight: 0.4,
        accuracyWeight: 0.4,
        formatWeight: 0.2
    },

    constraints: {
        requireValidJSON: true,
        maxTokens: 2048
    }
};

// Allow ALF to update rules safely
export function updateRule(path, value) {
    const parts = path.split(".");
    let obj = RULES;

    for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
    }

    obj[parts[parts.length - 1]] = value;
}
