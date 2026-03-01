import { QuantumState, Gate } from "./simulator";
import { calculateEntropyForCut } from "./entropy";

export type SimulationRequest = {
    numQubits: number;
    gates: Gate[];
};

export type SimulationResponse = {
    entropies: number[][]; // [step][cut]
    peakEntropy: number;
    hardnessScore: number;
    amplitudes: Float64Array; // final state
};

self.onmessage = (e: MessageEvent<SimulationRequest>) => {
    const { numQubits, gates } = e.data;
    const state = new QuantumState(numQubits);

    const entropies: number[][] = [];
    let peakEntropy = 0;

    for (let step = 0; step < gates.length; step++) {
        state.applyGate(gates[step]);

        // Compute entropy for all n-1 cuts
        const stepEntropies: number[] = [];
        for (let cut = 1; cut < numQubits; cut++) {
            const ent = calculateEntropyForCut(state.amplitudes, numQubits, cut);
            stepEntropies.push(ent);
            if (ent > peakEntropy) {
                peakEntropy = ent;
            }
        }
        entropies.push(stepEntropies);
    }

    // Heuristic hardness score (0 to 100)
    // Based on peak entropy, 2-qubit gate count, and total depth
    const twoQubitGates = gates.filter(g => g.targets.length > 1 || (g.controls && g.controls.length > 0)).length;
    // Non-rigorous heuristic
    const hardness = Math.min(100, Math.round(
        (peakEntropy * 15) + (twoQubitGates * 2) + Math.sqrt(gates.length) * 5
    ));

    self.postMessage({
        entropies,
        peakEntropy,
        hardnessScore: hardness,
        amplitudes: state.amplitudes
    } as SimulationResponse);
};
