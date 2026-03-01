import React from 'react';

export default function AboutPage() {
    return (
        <main style={{ flex: 1, padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }} className="animate-fade">
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', background: 'linear-gradient(135deg, #fff, var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                About KET Profiler
            </h1>

            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                    Welcome to the <strong>KET (Quantum Entanglement Tracker) Circuit Complexity Profiler</strong>.
                    This tool was built to bridge the gap between quantum circuit design and intuitive physical understanding.
                </p>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>The Problem</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    When learning or developing quantum algorithms, standard circuit diagrams show gates and wires, but they completely hide
                    the most crucial quantum phenomenon: <strong>entanglement</strong>. Without a supercomputer, it's hard to tell if a circuit
                    is genuinely generating complex superposition states or just performing classical tracking.
                </p>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>Our Solution</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    KET Profiler visualizes entanglement evolution in real-time. By simulating the Statevector entirely in your browser
                    via Web Workers, we continuously calculate the <a href="https://en.wikipedia.org/wiki/Von_Neumann_entropy" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Von Neumann Entropy</a> across all possible bi-partitions of the circuit.
                </p>

                <ul style={{ listStyle: 'none', paddingLeft: '1rem', borderLeft: '2px solid var(--accent-primary)', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>✨ <strong>Zero Server Code:</strong> Absolute privacy and instant results on your device.</li>
                    <li style={{ marginBottom: '0.5rem' }}>✨ <strong>Visual Heatmaps:</strong> Identify entanglement bottlenecks and complexity spikes instantly.</li>
                    <li style={{ marginBottom: '0.5rem' }}>✨ <strong>Heuristic Score:</strong> A quick reference score indicating classical simulation difficulty.</li>
                </ul>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>Support & Unitary Fund</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    Developed by AxionSoftware Inc, this open-source tool supports the broader quantum computing community.
                    It represents an ongoing effort submitted for the <strong>Unitary Fund microgrant</strong> to encourage open ecosystem tools that prioritize education, accessibility, and robust visualizations.
                </p>
            </div>
        </main>
    );
}
