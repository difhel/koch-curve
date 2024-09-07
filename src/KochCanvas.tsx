import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import CanvasWorker from './canvasWorker?worker';

export interface Point {
  x: number;
  y: number;
}

interface KochCanvasProps {
  k: number;
  width: number;
  height: number;
  setStatus: (status: 'calculating' | 'rendering' | 'rendered') => void;
}

const KochCanvas: React.FC<KochCanvasProps> = ({ k, width, height, setStatus }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [offscreen, setOffscreen] = useState<OffscreenCanvas | null>(null);

  const worker = useMemo(() => {
    const temp = new CanvasWorker();
    temp.onmessage = (e) => {
      if (e.data.status) {
        setStatus(e.data.status);
      }
    };
    return temp;
  }, [setStatus]);

  const getOffscreenAndSendToWorker = useCallback(() => {
    if (offscreen) return offscreen;
    const temp = canvasRef.current!.transferControlToOffscreen();
    setOffscreen(temp);
    worker.postMessage({ canvas: temp }, [temp]);
    return temp;
  }, [offscreen, worker]);

  useEffect(() => {
      getOffscreenAndSendToWorker();
      setStatus('calculating');
      worker.postMessage({ width, height, k }, []);
  }, [k, width, height, setStatus, worker, getOffscreenAndSendToWorker]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};

export default KochCanvas;
