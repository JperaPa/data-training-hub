// scout-agent.js
export default {
    name: "Scout Agent",

    async run(input) {
        // Example: fetch gas prices
        const { zip } = input;

        try {
            const res = await fetch(`https://api.example.com/gas?zip=${zip}`);
            const data = await res.json();
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
};