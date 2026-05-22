// personal-finance-agent.js
import Scout from "./scout-agent.js";

export default {
    name: "Personal Finance Agent",

    async run(task, context) {
        const { zip } = task.payload;

        try {
            // 1. Get local gas prices from Scout Agent
            const localRes = await Scout.run({ payload: { zip } });
            const localPrices = localRes.data?.prices || [];

            const localAvg =
                localPrices.reduce((a, b) => a + b.price, 0) /
                (localPrices.length || 1);

            // 2. Get national average gas price (EIA API)
            const nationalRes = await fetch(
                "https://api.eia.gov/v2/petroleum/pri/gnd/data/?frequency=weekly&data[0]=value&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=1"
            );

            const nationalJson = await nationalRes.json();
            const nationalAvg = nationalJson?.response?.data?.[0]?.value || null;

            // 3. Compute comparison
            const difference = localAvg - nationalAvg;
            const percentDiff = ((difference / nationalAvg) * 100).toFixed(2);

            return {
                agent: this.name,
                taskId: task.taskId,
                status: "success",
                confidence: 0.9,
                result: {
                    localAvg: Number(localAvg.toFixed(2)),
                    nationalAvg: Number(nationalAvg.toFixed(2)),
                    difference: Number(difference.toFixed(2)),
                    percentDiff,
                    localStations: localPrices
                }
            };
        } catch (err) {
            return {
                agent: this.name,
                taskId: task.taskId,
                status: "error",
                confidence: 0.2,
                result: { error: err.message }
            };
        }
    }
};
