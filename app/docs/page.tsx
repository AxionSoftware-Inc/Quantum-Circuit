import React from 'react';
import Link from 'next/link';

export default function DocsPage() {
    return (
        <main style={{ flex: 1, padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }} className="animate-fade">
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', background: 'linear-gradient(135deg, #fff, var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Documentation
            </h1>

            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                <p style={{ marginBottom: '2rem' }}>
                    Welcome to the KET Profiler documentation. Here you can learn how the profiler computes algorithms.
                </p>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>Supported Gates</h2>
                <div style={{ background: 'var(--bg-panel)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <p>
                        The backend engine (running in the browser) natively supports the following gate primitives on Statevectors:
                    </p>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                        <li><code>H</code> - Hadamard</li>
                        <li><code>X, Y, Z</code> - Pauli Gates</li>
                        <li><code>RX, RY, RZ(&theta;)</code> - Parametrized Rotation Gates</li>
                        <li><code>CX</code> - CNOT (Controlled-X)</li>
                        <li><code>CZ</code> - Controlled-Z</li>
                    </ul>
                </div>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>Entanglement Entropy</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    When computing the heatmap, the application creates a bi-partition for every possible wire cut.
                    For a 5-qubit circuit, the cuts are: <code>(0|1234), (01|234), (012|34), (0123|4)</code>.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    For each partition, it calculates the reduced density matrix by tracing out the smaller subset,
                    then computes the eigenvalues using the iterative <strong>Jacobi Eigenvalue Algorithm</strong> to derive
                    the exact Von Neumann Entropy in bits.
                </p>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>Heuristic Score</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    The Hardness heuristic attempts to reflect the complexity of finding a complete classical tensor-network contraction sequence:
                </p>
                <code style={{ background: '#11121a', padding: '1rem', display: 'block', borderRadius: '8px', color: '#fff', fontSize: '0.95rem' }}>
                    Score = min(100, Peak_Entropy * 15 + Entangling_Gates * 2 + sqrt(Depth) * 5)
                </code>

                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
                        &laquo; Back to Profiler
                    </Link>
                </div>
            </div>
        </main>
    );
}
