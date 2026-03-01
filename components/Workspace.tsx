"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Gate, GateType } from '../lib/quantum/simulator';
import type { SimulationRequest, SimulationResponse } from '../lib/quantum/worker';

export default function Workspace() {
    const [numQubits, setNumQubits] = useState(5);
    const [gates, setGates] = useState<Gate[]>([]);
    const [results, setResults] = useState<SimulationResponse | null>(null);
    const [isComputing, setIsComputing] = useState(false);

    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // Initialize Web Worker
        workerRef.current = new Worker(new URL('../lib/quantum/worker.ts', import.meta.url));
        workerRef.current.onmessage = (e: MessageEvent<SimulationResponse>) => {
            setResults(e.data);
            setIsComputing(false);
        };
        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    useEffect(() => {
        if (workerRef.current) {
            setIsComputing(true);
            workerRef.current.postMessage({ numQubits, gates } as SimulationRequest);
        }
    }, [gates, numQubits]);


    const [code, setCode] = useState<string>('');

    // Parse pseudo code into Gates whenever code changes
    useEffect(() => {
        const parsedGates: Gate[] = [];
        const lines = code.split('\n');
        for (const line of lines) {
            const parts = line.trim().split(/\s+/).filter(Boolean);
            if (parts.length < 2) continue;
            const op = parts[0].toUpperCase() as GateType;

            try {
                if (op === 'CX' || op === 'CZ') {
                    if (parts.length >= 3) {
                        const c = parseInt(parts[1].replace(/\D/g, ''));
                        const t = parseInt(parts[2].replace(/\D/g, ''));
                        parsedGates.push({ type: op, targets: [t], controls: [c] });
                    }
                } else if (op === 'RX' || op === 'RY' || op === 'RZ') {
                    if (parts.length >= 3) {
                        const t = parseInt(parts[1].replace(/\D/g, ''));
                        let p = parseFloat(parts[2]);
                        if (parts[2].includes('PI')) p = Math.PI * (parseFloat(parts[2].replace('PI', '')) || 1);
                        parsedGates.push({ type: op, targets: [t], param: p });
                    }
                } else if (Object.values(GateType).includes(op)) {
                    const t = parseInt(parts[1].replace(/\D/g, ''));
                    parsedGates.push({ type: op, targets: [t] });
                }
            } catch (e) {
                // ignore parsing errors and move on
            }
        }
        setGates(parsedGates);
    }, [code]);

    const loadTemplate = (name: string) => {
        if (name === 'GHZ') {
            let c = `H 0\n`;
            for (let i = 0; i < numQubits - 1; i++) c += `CX ${i} ${i + 1}\n`;
            setCode(c);
        } else if (name === 'VQE_Ansatz_Layer') {
            let c = ``;
            for (let i = 0; i < numQubits; i++) c += `RY ${i} 0.785\n`;
            for (let i = 0; i < numQubits - 1; i++) c += `CX ${i} ${i + 1}\n`;
            setCode(c);
        } else if (name === 'Random_Circuit') {
            let c = ``;
            for (let i = 0; i < 20; i++) {
                const t = Math.floor(Math.random() * numQubits);
                const type = ['H', 'X', 'RZ'][Math.floor(Math.random() * 3)];
                if (type === 'RZ') {
                    c += `RZ ${t} ${Math.random().toFixed(2)}\n`;
                } else {
                    c += `${type} ${t}\n`;
                }
                if (Math.random() < 0.3 && numQubits > 1) {
                    let cn = Math.floor(Math.random() * numQubits);
                    while (cn === t) cn = Math.floor(Math.random() * numQubits);
                    c += `CX ${cn} ${t}\n`;
                }
            }
            setCode(c);
        } else if (name === 'Bell') {
            if (numQubits >= 2) setCode(`H 0\nCX 0 1\n`);
        } else if (name === 'QAOA_MaxCut') {
            let c = ``;
            for (let i = 0; i < numQubits; i++) c += `H ${i}\n`;
            for (let i = 0; i < numQubits; i++) {
                const next = (i + 1) % numQubits;
                if (numQubits > 1 && i < numQubits - 1) {
                    c += `CX ${i} ${next}\nRZ ${next} 1.047\nCX ${i} ${next}\n`;
                }
            }
            for (let i = 0; i < numQubits; i++) c += `H ${i}\nRZ ${i} -0.785\nH ${i}\n`;
            setCode(c);
        }
    };

    const clearCircuit = () => {
        setCode('');
    };

    // Rendering the circuit
    // Display qubits as rows, steps as columns

    return (
        <div className="workspace animate-fade">
            <div className="panel editor-panel">
                <h2 className="section-title">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Code & Circuit Viewer
                </h2>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ marginRight: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Qubits</label>
                        <select value={numQubits} onChange={(e) => { setNumQubits(parseInt(e.target.value)); setCode(''); }} className="select-box" style={{ width: '80px' }}>
                            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>

                    <button className="btn" onClick={() => loadTemplate('GHZ')}>GHZ</button>
                    <button className="btn" onClick={() => loadTemplate('Bell')}>Bell</button>
                    <button className="btn" onClick={() => loadTemplate('VQE_Ansatz_Layer')}>VQE</button>
                    <button className="btn" onClick={() => loadTemplate('QAOA_MaxCut')}>QAOA</button>
                    <button className="btn" onClick={() => loadTemplate('Random_Circuit')}>Random</button>
                    <div style={{ flex: 1 }}></div>
                    <button className="btn" onClick={clearCircuit} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Clear</button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Write pseudo code here... e.g.&#10;H 0&#10;CX 0 1&#10;RZ 1 1.57"
                        style={{ width: '100%', height: '150px', background: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '1rem', fontFamily: 'var(--font-geist-mono), monospace', resize: 'vertical' }}
                    />

                    <div className="circuit-grid" style={{ flex: 1, border: '1px solid var(--border-light)', borderRadius: '8px', padding: '1rem', minHeight: '200px' }}>
                        {Array.from({ length: numQubits }).map((_, qIndex) => (
                            <div key={qIndex} className="circuit-wire">
                                <div className="wire-label">q[{qIndex}]</div>
                                {gates.map((g, stepIdx) => {
                                    const isTarget = g.targets.includes(qIndex);
                                    const isControl = g.controls?.includes(qIndex);
                                    const isMulti = isTarget || isControl;

                                    return (
                                        <div key={stepIdx} className="circuit-step" style={{ minWidth: '60px' }}>
                                            {/* Vertical line for multi-qubit gates */}
                                            {isMulti && g.controls && g.targets && (
                                                <div className="vertical-line" style={{
                                                    top: Math.min(g.targets[0], g.controls[0]) < qIndex ? '-30px' : '22px',
                                                    height: Math.abs(g.targets[0] - (g.controls[0] || 0)) >= 1 && (Math.min(g.targets[0], g.controls[0]) < qIndex && Math.max(g.targets[0], g.controls[0]) > qIndex) ? '60px' :
                                                        (qIndex === Math.min(g.targets[0], g.controls[0]) ? '38px' : '0px')
                                                }} />
                                            )}

                                            {isTarget && <div className="placed-gate">{g.type}</div>}
                                            {isControl && <div className="placed-gate control"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="panel metrics-panel">
                <h2 className="section-title">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Profiler Metrics
                </h2>

                {isComputing ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        Simulating Quantum State...
                    </div>
                ) : results ? (
                    <div className="animate-fade">
                        <div className="metric-card">
                            <div className="metric-header">Heuristic Hardness Score</div>
                            <div className="metric-value">
                                {results.hardnessScore} <span>/ 100</span>
                            </div>
                            <div className="hardness-bar">
                                <div className="hardness-fill" style={{ width: `${results.hardnessScore}%` }}></div>
                            </div>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Estimates classical simulation difficulty based on entanglement growth and multi-qubit gates.
                            </p>
                        </div>

                        <div className="metric-card">
                            <div className="metric-header">Peak Entanglement Entropy</div>
                            <div className="metric-value">
                                {results.peakEntropy.toFixed(3)} <span>e-bits</span>
                            </div>
                        </div>

                        <div>
                            <div className="metric-header" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Entanglement Heatmap</div>
                            {/* Just a simple visual heatmap for the final step */}
                            {results.entropies.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {Array.from({ length: numQubits - 1 }).map((_, cutIdx) => {
                                        const maxEntForThisCut = Math.max(...results.entropies.map((s) => s[cutIdx]));
                                        const val = maxEntForThisCut;
                                        const intensity = Math.min(1, val / 1.5); // Normalize approx
                                        return (
                                            <div key={cutIdx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '40px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cut {cutIdx}:{cutIdx + 1}</div>
                                                <div style={{ flex: 1, height: '12px', background: 'var(--bg-base)', borderRadius: '6px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        height: '100%',
                                                        width: `${Math.max(2, intensity * 100)}%`,
                                                        background: `linear-gradient(90deg, var(--accent-primary), #ec4899)`,
                                                        opacity: intensity + 0.2
                                                    }}></div>
                                                </div>
                                                <div style={{ width: '30px', fontSize: '0.8rem', textAlign: 'right' }}>{val.toFixed(2)}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        Add gates to see metrics.
                    </div>
                )}
            </div>
        </div>
    );
}
