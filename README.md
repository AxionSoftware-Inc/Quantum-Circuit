# KET Circuit Complexity Profiler

A client-side quantum circuit analysis workspace that visualizes entanglement growth and heuristic simulation difficulty — running entirely in your browser.

## Why this exists

Most quantum learners and developers design circuits without intuition for how entanglement evolves over time.

KET Circuit Complexity Profiler makes entanglement visible in real time by:

- Simulating statevector evolution locally (≤10 qubits)
- Computing Von Neumann entropy across circuit cuts
- Highlighting complexity spikes and entanglement growth
- Estimating classical simulation difficulty heuristically

All computation runs 100% in the browser. No backend required.

---

## Features

- Client-side statevector simulator (H, X, RZ, CX gates)
- Entanglement entropy heatmap (per cut, per step)
- Timeline visualization of entanglement growth
- Heuristic hardness score (non-rigorous, educational)
- Web Worker compute engine (non-blocking UI)
- Mobile-responsive UI
- SEO-friendly documentation pages
- Demo mode for instant preview

---

## Limits

To keep the tool responsive and accessible:

- Maximum qubits: 10
- Maximum steps: 150
- Intended for educational and small-circuit exploration

This is not a full-scale quantum simulator.

---

## How It Works

1. Circuit input (Gate JSON or example)
2. Client-side statevector simulation
3. Entanglement entropy computed for all bi-partitions
4. Metrics visualized in real-time
5. Heuristic hardness score calculated from:
   - Peak entropy
   - Two-qubit gate density
   - Circuit depth

---

## Quick Start

```bash
npm install
npm run dev