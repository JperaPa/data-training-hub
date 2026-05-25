// utils.js
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function getSystemLoad() {
    const memory = performance.memory ? performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit : 0;
    const cpu = window.__cpuLoad || 0; // optional if you add CPU sampling later
    return Math.max(memory, cpu);
}
export function getSystemLoad() {
    // CPU from preload (0–1)
    const cpu = window.systemLoad?.getCpuLoad
        ? window.systemLoad.getCpuLoad()
        : 0;

    // JS heap memory (0–1) if available
    let memory = 0;
    if (performance && performance.memory) {
        const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
        memory = jsHeapSizeLimit ? usedJSHeapSize / jsHeapSizeLimit : 0;
    }

    // Weighted blend: CPU heavier than memory
    const load = (cpu * 0.7) + (memory * 0.3);

    // Clamp 0–1
    return Math.max(0, Math.min(1, load));
}
