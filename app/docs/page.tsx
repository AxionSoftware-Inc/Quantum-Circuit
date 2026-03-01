import React from 'react';
import Link from 'next/link';

export default function DocsPage() {
    return (
        <main style={{ flex: 1, padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }} className="animate-fade">
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', background: 'linear-gradient(135deg, #fff, var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Documentation
            </h1>

            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                <p style={{ marginBottom: '2.5rem' }}>
                    Welcome to the <strong>KET Profiler</strong> documentation. Here you can learn about the architecture, how the profiler computes algorithms, and the underlying physics metrics used.
                </p>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>1. Overview</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    The KET Quantum Profiler is a <strong>Client-Side (CSR) quantum analysis web application</strong> that provides real-time visibility into quantum circuit execution and resource metrics directly inside your browser.
                    It performs heavy statevector simulations and Von Neumann entanglement entropy calculations 100% locally.
                </p>


                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>2. Supported Commands and Gates</h2>
                <div style={{ background: 'var(--bg-panel)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <p>
                        The backend engine natively supports standard pseudocode or basic <strong>OpenQASM 2.0</strong> syntaxes on Statevectors:
                    </p>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                        <li style={{ marginBottom: '0.4rem' }}><code>H &lt;target&gt;</code> - Hadamard</li>
                        <li style={{ marginBottom: '0.4rem' }}><code>X, Y, Z &lt;target&gt;</code> - Pauli Gates</li>
                        <li style={{ marginBottom: '0.4rem' }}><code>RX, RY, RZ &lt;target&gt; &lt;theta&gt;</code> - Parametrized Rotation Gates (e.g. <code>RZ 0 1.57</code> or <code>RX 1 PI/2</code>)</li>
                        <li style={{ marginBottom: '0.4rem' }}><code>CX &lt;control&gt; &lt;target&gt;</code> - CNOT (Controlled-X)</li>
                        <li style={{ marginBottom: '0.4rem' }}><code>CZ &lt;control&gt; &lt;target&gt;</code> - Controlled-Z</li>
                    </ul>
                </div>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>3. Entanglement Entropy</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    When computing the heatmap, the application creates a bi-partition for every possible wire cut.
                    For a 5-qubit circuit, the cuts are: <code>(0|1234), (01|234), (012|34), (0123|4)</code>.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    For each partition, it calculates the <strong>reduced density matrix</strong> by tracing out the smaller subset,
                    then computes the eigenvalues using the iterative <strong>Jacobi Eigenvalue Algorithm</strong> to derive
                    the exact Von Neumann Entropy in bits. The deeper the redness on the heatmap, the higher the entanglement scale.
                </p>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>4. State Probabilities</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    Upon analyzing all steps, the final step calculates the squared magnitudes of the complex probability amplitudes for every state in the superposition. The result shows the <strong>Top 8 most probable measurement outcomes</strong>, helping developers confirm that their algorithm converges to the desired state.
                </p>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>5. Performance Warning</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    We use <strong>Web Workers</strong> to offload computations to a separate thread so the user interface remains responsive. However, simulating $N$ qubits requires computing $2^N$ complex amplitudes and up to $O(2^2N)$ matrix operations for entropy. Due to Javascript memory limitations, selecting <strong>10 or more qubits</strong> may result in performance drops or browser freezes on low-end devices.
                </p>

                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
                        &laquo; Back to Profiler Workspace
                    </Link>
                </div>
            </div>
        </main>
    );
}