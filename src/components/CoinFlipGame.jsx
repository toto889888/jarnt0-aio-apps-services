import React, { useState, useRef } from 'react';
import './CoinFlipGame.css'; // We will create this CSS file

const CoinFlipGame = () => {
  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState([]);
  const handleFlip = () => {
    if (flipping) return;

    setFlipping(true);
    setResult(null);

    // Simulate coin flip
    const isHeads = Math.random() < 0.5;
    const newResult = isHeads ? 'ຫົວ' : 'ກ້ອຍ';

    setTimeout(() => {
      setResult(newResult);
      setHistory(prevHistory => [
        { id: Date.now(), result: newResult, isHeads: isHeads },
        ...prevHistory.slice(0, 2) // Keep last 3 results
      ]);
      setFlipping(false);
    }, 2000); // Animation duration
  };

  return (
    <div className="coin-flip-container">
      <h2>ເກມຫົວ-ກ້ອຍ</h2>

      <div className={`coin ${flipping ? 'flipping' : ''} ${result === 'หัว' ? 'heads' : result === 'ก้อย' ? 'tails' : ''}`}>
        <div className="face heads">ຫົວ</div>
        <div className="face tails">ກ້ອຍ</div>
      </div>

      <button className="btn btn-primary btn-lg mt-4" onClick={handleFlip} disabled={flipping}>
        {flipping ? 'ກຳລັງໂຍນ...' : 'ໂຍນຫຼຽນ'}
      </button>

      {result && (
        <div className="result-display mt-4">
          <h3>ຜົນລັບ:</h3>
          <p className="display-4 text-success">{result}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section mt-4">
          <h3>ປະຫວັດການໂຍນ (ລ່າສຸດ 3 ຄັ້ງ):</h3>
          <ul className="list-group">
            {history.map((item) => (
              <li key={item.id} className={`list-group-item ${item.isHeads ? 'list-group-item-info' : 'list-group-item-warning'}`}>
                {item.result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CoinFlipGame;
