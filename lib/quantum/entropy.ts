export function calculateEntropyForCut(amplitudes: Float64Array, numQubits: number, cutIndex: number): number {
    // cutIndex is the number of qubits in set A. A = {0, 1, ..., cutIndex-1}
    // B = {cutIndex, ..., numQubits-1}
    const vA = 1 << cutIndex;
    const vB = 1 << (numQubits - cutIndex);

    // Choose the smaller subsystem for density matrix to save space
    const dim = Math.min(vA, vB);
    const isA_smaller = vA <= vB;

    // We form the density matrix rho of the smaller subsystem.
    // rho is a dim x dim Hermitian matrix.
    // We represent rho as a 2*dim x 2*dim real symmetric matrix S
    // S = [ Re(rho)  -Im(rho) ]
    //     [ Im(rho)   Re(rho) ]

    const S = new Float64Array(4 * dim * dim);

    // Calculate rho
    for (let i = 0; i < dim; i++) {
        for (let ip = 0; ip <= i; ip++) {
            let sumRe = 0;
            let sumIm = 0;

            if (isA_smaller) {
                // A is smaller. i and ip are indices in A.
                for (let j = 0; j < vB; j++) {
                    const idx1 = j * vA + i;
                    const idx2 = j * vA + ip;
                    const r1 = amplitudes[idx1 * 2];
                    const i1 = amplitudes[idx1 * 2 + 1];
                    const r2 = amplitudes[idx2 * 2];
                    const i2 = amplitudes[idx2 * 2 + 1];

                    // M_{i, j} * M_{ip, j}^*
                    // (r1 + i1*1i) * (r2 - i2*1i) = (r1*r2 + i1*i2) + 1i * (i1*r2 - r1*i2)
                    sumRe += r1 * r2 + i1 * i2;
                    sumIm += i1 * r2 - r1 * i2;
                }
            } else {
                // B is smaller. i and ip are indices in B.
                for (let j = 0; j < vA; j++) {
                    const idx1 = i * vA + j;
                    const idx2 = ip * vA + j;
                    const r1 = amplitudes[idx1 * 2];
                    const i1 = amplitudes[idx1 * 2 + 1];
                    const r2 = amplitudes[idx2 * 2];
                    const i2 = amplitudes[idx2 * 2 + 1];

                    sumRe += r1 * r2 + i1 * i2;
                    sumIm += i1 * r2 - r1 * i2;
                }
            }

            // Fill S matrix (size 2*dim x 2*dim)
            // Top-Left: Re(rho), Bottom-Right: Re(rho)
            // Top-Right: -Im(rho), Bottom-Left: Im(rho)

            const n2 = 2 * dim;
            // Re(rho)[i, ip]
            S[i * n2 + ip] = sumRe;
            S[ip * n2 + i] = sumRe;
            S[(i + dim) * n2 + (ip + dim)] = sumRe;
            S[(ip + dim) * n2 + (i + dim)] = sumRe;

            // Im(rho)[i, ip]  -- Note rho is Hermitian, so rho[ip, i] = conj(rho[i, ip])
            // So Im(rho)[ip, i] = -Im(rho)[i, ip]
            S[(i + dim) * n2 + ip] = sumIm;
            S[(ip + dim) * n2 + i] = -sumIm; // Because Im(rho)[ip, i] = -sumIm

            S[i * n2 + (ip + dim)] = -sumIm;
            S[ip * n2 + (i + dim)] = sumIm;
        }
    }

    // Find eigenvalues of S using Jacobi method
    const evals = jacobiEigenvalues(S, 2 * dim);

    // The eigenvalues of S are doubly degenerate eigenvalues of rho.
    // We just collect all positive eigenvalues and divide their sum of entropy by 2
    // Or just take the first N eigenvalues (they appear in pairs)
    // Let's just sum all e * log(e) and divide by 2.

    let entropy = 0;
    for (let i = 0; i < evals.length; i++) {
        const p = evals[i];
        if (p > 1e-10) {
            entropy -= p * Math.log2(p);
        }
    }

    return entropy / 2;
}

function jacobiEigenvalues(A_orig: Float64Array, n: number, maxIter: number = 100): Float64Array {
    const A = new Float64Array(A_orig);
    const D = new Float64Array(n);

    for (let iter = 0; iter < maxIter; iter++) {
        let maxOffDiag = 0;
        let p = 0, q = 0;
        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                const val = Math.abs(A[i * n + j]);
                if (val > maxOffDiag) {
                    maxOffDiag = val;
                    p = i; q = j;
                }
            }
        }
        if (maxOffDiag < 1e-12) break;

        const app = A[p * n + p];
        const aqq = A[q * n + q];
        const apq = A[p * n + q];
        const theta = 0.5 * Math.atan2(2 * apq, aqq - app);
        const c = Math.cos(theta);
        const s = Math.sin(theta);

        for (let i = 0; i < n; i++) {
            if (i !== p && i !== q) {
                const api = A[p * n + i];
                const aqi = A[q * n + i];
                A[p * n + i] = A[i * n + p] = c * api - s * aqi;
                A[q * n + i] = A[i * n + q] = s * api + c * aqi;
            }
        }
        A[p * n + p] = c * c * app - 2 * s * c * apq + s * s * aqq;
        A[q * n + q] = s * s * app + 2 * s * c * apq + c * c * aqq;
        A[p * n + q] = A[q * n + p] = 0;
    }
    for (let i = 0; i < n; i++) D[i] = A[i * n + i];
    return D;
}
