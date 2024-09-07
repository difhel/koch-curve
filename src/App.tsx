import React, { useRef, useState } from 'react';
import KochCanvas from './KochCanvas';

const App: React.FC = () => {
  const [k, setK] = useState<number>(5);
  const [status, setStatus] = useState<'initial' | 'calculating' | 'rendering' | 'rendered'>('initial');

  const width = window.innerWidth * 0.8;
  const height = window.innerHeight * 0.8;

  const shouldDisableButtons = status !== 'rendered' && status !== 'initial';

  const statusRef = useRef<HTMLSpanElement>(null);

  return (
    <div>
      <h1>Koch Curve</h1>
      <div>
        <button onClick={() => setK(k > 0 ? k - 1 : 0)} disabled={shouldDisableButtons}>Decrease k</button>
        <button onClick={() => setK(k + 1)} disabled={shouldDisableButtons}>Increase k</button>
        <React.Fragment key="k">Current k: {k}</React.Fragment>
        <br />
        <span ref={statusRef}>Status: {status}</span>
        <br />
        <input
          type="range" min="0" max="13"
          disabled={shouldDisableButtons}
          value={k}
          onChange={e => setK(parseInt(e.target.value))}
        />
      </div>
      <KochCanvas k={k} width={width} height={height} setStatus={setStatus} />
    </div>
  );
};

export default App;
