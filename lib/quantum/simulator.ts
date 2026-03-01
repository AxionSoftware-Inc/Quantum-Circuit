export enum GateType {
  I = 'I',
  H = 'H',
  X = 'X',
  Y = 'Y',
  Z = 'Z',
  RX = 'RX',
  RY = 'RY',
  RZ = 'RZ',
  CX = 'CX',
  CZ = 'CZ',
  SWAP = 'SWAP',
}

export interface Gate {
  type: GateType;
  targets: number[];
  controls?: number[];
  param?: number; // For rotation gates
}

export class QuantumState {
  numQubits: number;
  amplitudes: Float64Array; // [real0, imag0, real1, imag1, ...]

  constructor(numQubits: number) {
    this.numQubits = numQubits;
    const numStates = 1 << numQubits;
    this.amplitudes = new Float64Array(numStates * 2);
    // Initial state |0...0>
    this.amplitudes[0] = 1.0;
    this.amplitudes[1] = 0.0;
  }

  applyGate(gate: Gate) {
    const { type, targets, controls = [], param = 0 } = gate;
    const numStates = 1 << this.numQubits;
    
    // Check controls mask
    let controlMask = 0;
    for (const c of controls) controlMask |= (1 << c);

    const t = targets[0];
    const tMask = 1 << t;

    const newAmplitudes = new Float64Array(this.amplitudes.length);
    newAmplitudes.set(this.amplitudes);

    if (type === GateType.CX) {
      for (let i = 0; i < numStates; i++) {
        if ((i & controlMask) === controlMask) {
          const pair = i ^ tMask;
          if (i < pair) {
            const r1 = this.amplitudes[i * 2];
            const i1 = this.amplitudes[i * 2 + 1];
            const r2 = this.amplitudes[pair * 2];
            const i2 = this.amplitudes[pair * 2 + 1];

            newAmplitudes[i * 2] = r2;
            newAmplitudes[i * 2 + 1] = i2;
            newAmplitudes[pair * 2] = r1;
            newAmplitudes[pair * 2 + 1] = i1;
          }
        }
      }
    } else if (type === GateType.CZ) {
       for (let i = 0; i < numStates; i++) {
        if ((i & controlMask) === controlMask && (i & tMask) !== 0) {
           newAmplitudes[i * 2] = -this.amplitudes[i * 2];
           newAmplitudes[i * 2 + 1] = -this.amplitudes[i * 2 + 1];
        }
       }
    } else if (type === GateType.H) {
      const invSqrt2 = 1 / Math.sqrt(2);
      for (let i = 0; i < numStates; i++) {
        if ((i & controlMask) === controlMask) {
          if ((i & tMask) === 0) {
            const pair = i | tMask;
            const r0 = this.amplitudes[i * 2];
            const i0 = this.amplitudes[i * 2 + 1];
            const r1 = this.amplitudes[pair * 2];
            const i1 = this.amplitudes[pair * 2 + 1];

            newAmplitudes[i * 2] = (r0 + r1) * invSqrt2;
            newAmplitudes[i * 2 + 1] = (i0 + i1) * invSqrt2;
            newAmplitudes[pair * 2] = (r0 - r1) * invSqrt2;
            newAmplitudes[pair * 2 + 1] = (i0 - i1) * invSqrt2;
          }
        }
      }
    } else if (type === GateType.X) {
      for (let i = 0; i < numStates; i++) {
        if ((i & controlMask) === controlMask) {
          if ((i & tMask) === 0) {
            const pair = i | tMask;
            const r0 = this.amplitudes[i * 2];
            const i0 = this.amplitudes[i * 2 + 1];
            newAmplitudes[i * 2] = this.amplitudes[pair * 2];
            newAmplitudes[i * 2 + 1] = this.amplitudes[pair * 2 + 1];
            newAmplitudes[pair * 2] = r0;
            newAmplitudes[pair * 2 + 1] = i0;
          }
        }
      }
    } else if (type === GateType.RZ) {
      const cosAngle = Math.cos(param / 2);
      const sinAngle = Math.sin(param / 2);
      for (let i = 0; i < numStates; i++) {
        if ((i & controlMask) === controlMask) {
           const bit = (i & tMask) === 0 ? -1 : 1;
           const r = this.amplitudes[i * 2];
           const im = this.amplitudes[i * 2 + 1];
           // phase is exp(-i * bit * param/2)
           // exp(i * theta) = cos(theta) + i*sin(theta)
           // theta = -bit * param/2
           const tCos = Math.cos(-bit * param / 2);
           const tSin = Math.sin(-bit * param / 2);
           newAmplitudes[i*2] = r * tCos - im * tSin;
           newAmplitudes[i*2+1] = r * tSin + im * tCos;
        }
      }
    }

    this.amplitudes = newAmplitudes;
  }

  clone(): QuantumState {
    const s = new QuantumState(this.numQubits);
    s.amplitudes.set(this.amplitudes);
    return s;
  }
}
