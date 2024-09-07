import { Point } from './KochCanvas';
import Module from './wasm/koch';

let canvas: OffscreenCanvas | undefined;

self.onmessage = async function (e) {
    if ('canvas' in e.data) {
        canvas = e.data.canvas as OffscreenCanvas;
        return;
    }

    const { width, height, k } = e.data as {
        width: number;
        height: number;
        k: number;
    };

    const Y_OFFSET = + height * 0.5 - 30;

    const wasmModule = await Module({ locateFile: () => '/koch.wasm?public' });

    const outLengthPointer = wasmModule._malloc(4);
    const resultPointer = wasmModule._generateKochCurve(k, 0, height / 2, width, height / 2, outLengthPointer);
    const originalPointer = resultPointer;
    const length = wasmModule.HEAP32[outLengthPointer >> 2];

    const points: Point[] = [];
    for (let i = 0; i < length; i++) {
        const x = wasmModule.HEAPF32[(resultPointer / 4) + i * 2];
        const y = wasmModule.HEAPF32[(resultPointer / 4) + i * 2 + 1];
        points.push({ x, y });
    }
    console.log('New points', points, length, k)
    console.assert(originalPointer === resultPointer);
    wasmModule._free(resultPointer);
    wasmModule._free(outLengthPointer);

    self.postMessage({ status: 'rendering' });

    const ctx = canvas!.getContext('2d');
    if (!ctx) return;
    if (points.length === 0) return self.postMessage({ status: 'rendered' });
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y + Y_OFFSET);

    points.forEach(point => ctx.lineTo(point.x, point.y + Y_OFFSET));

    ctx.stroke();
    return self.postMessage({ status: 'rendered' });
};
