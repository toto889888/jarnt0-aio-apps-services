import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SpinWheelGame.css';

const COLORS = ['#FFC107', '#FF5722', '#8BC34A', '#03A9F4', '#9C27B0', '#E91E63', '#4CAF50', '#F44336', '#2196F3', '#FF9800'];

const SpinWheelGame = () => {
  const [masterNames, setMasterNames] = useState([]);
  const [wheelNames, setWheelNames] = useState([]);
  const [multiplier, setMultiplier] = useState(1);
  const [multiplierInput, setMultiplierInput] = useState(1);
  const [newName, setNewName] = useState('');
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canvasRef = useRef(null);
  const wheelSectionRef = useRef(null);

  useEffect(() => {
    const newWheelNames = [];
    for (let i = 0; i < multiplier; i++) {
      newWheelNames.push(...masterNames);
    }
    setWheelNames(newWheelNames);
  }, [masterNames, multiplier]);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = wheelSectionRef.current;
    const size = Math.min(container.clientWidth, 420);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    const arc = wheelNames.length > 0 ? (2 * Math.PI) / wheelNames.length : 2 * Math.PI;
    const radius = size / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.font = `${size * 0.04}px Kanit, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    if (wheelNames.length === 0) {
        ctx.fillStyle = '#E0E0E0';
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#9E9E9E';
        ctx.fillText("ເພີ່ມລາຍຊື່", radius, radius);
        return;
    }

    wheelNames.forEach((name, i) => {
      const angle = i * arc;
      ctx.fillStyle = COLORS[i % COLORS.length];

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 5, angle, angle + arc);
      ctx.closePath();
      ctx.fill();

      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.translate(
        radius + Math.cos(angle + arc / 2) * (radius * 0.6),
        radius + Math.sin(angle + arc / 2) * (radius * 0.6)
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      ctx.fillText(name, 0, 0);
      ctx.restore();
    });
  }, [wheelNames]);

  useEffect(() => {
    drawWheel();
    window.addEventListener('resize', drawWheel);
    return () => window.removeEventListener('resize', drawWheel);
  }, [drawWheel]);

  const handleAddName = () => {
    if (newName.trim() && !masterNames.includes(newName.trim())) {
      setMasterNames([...masterNames, newName.trim()]);
      setNewName('');
    }
  };

  const handleRemoveName = (indexToRemove) => {
    setMasterNames(masterNames.filter((_, i) => i !== indexToRemove));
  };

  const handleEdit = (index, name) => {
    setEditingIndex(index);
    setEditingText(name);
  };

  const handleSaveEdit = () => {
    if (editingText.trim()) {
        const updatedNames = [...masterNames];
        updatedNames[editingIndex] = editingText.trim();
        setMasterNames(updatedNames);
        setEditingIndex(null);
        setEditingText('');
    }
  };

  const handleApplyMultiplier = () => {
    if (multiplierInput >= 1) {
        setMultiplier(multiplierInput);
    }
  };

  const handleResetMultiplier = () => {
    setMultiplier(1);
    setMultiplierInput(1);
  };

  const closeModal = () => {
    setWinner(null);
    setIsModalOpen(false);
  }

  const handleRemoveWinner = () => {
    if (!winner) return;
    setMasterNames(masterNames.filter(name => name !== winner));
    closeModal();
  };

  const spin = () => {
    if (isSpinning || wheelNames.length < 2) return;

    setIsSpinning(true);
    const randomSpin = Math.floor(Math.random() * 360) + 360 * 5;
    const newRotation = rotation + randomSpin;
    setRotation(newRotation);

    const degreesPerSlice = 360 / wheelNames.length;
    const finalAngle = newRotation % 360;
    const winnerIndex = Math.floor((360 - finalAngle + degreesPerSlice / 2) % 360 / degreesPerSlice);

    setTimeout(() => {
      setWinner(wheelNames[winnerIndex]);
      setIsModalOpen(true);
      setIsSpinning(false);
    }, 5000);
  };

  return (
    <>
      <div className="sw-container">
        <h2 className="sw-title">ວົງລໍ້ສຸ່ມຊື່</h2>
        <div className="sw-main-content">
          <div className="sw-wheel-section" ref={wheelSectionRef}>
            <div className="sw-pointer"></div>
            <div className="sw-wheel" style={{ transform: `rotate(${rotation}deg)` }}>
              <canvas ref={canvasRef} id="wheelCanvas"></canvas>
            </div>
            <button onClick={spin} disabled={isSpinning || wheelNames.length < 2} className="sw-spin-button">
              {isSpinning ? 'ກຳລັງໝຸນ...' : 'ໝຸນວົງລໍ້!'}
            </button>
          </div>
          <div className="sw-controls-section">
            <div className="sw-add-name">
              <h3>ເພີ່ມລາຍຊື່ໃໝ່</h3>
              <div className="sw-input-group">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ໃສ່ຊື່ໃໝ່..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddName()}
                />
                <button onClick={handleAddName}>ເພີ່ມ</button>
              </div>
            </div>

            <div className="sw-multiplier">
                <h3>ຕົວຄູນລາຍຊື່ (ເພີ່ມຄວາມໜາແໜ້ນ)</h3>
                <div className="sw-input-group">
                    <input 
                        type="number" 
                        min="1" 
                        value={multiplierInput} 
                        onChange={(e) => setMultiplierInput(Number(e.target.value))}
                        className="sw-multiplier-input"
                    />
                    <button onClick={handleApplyMultiplier} className="sw-apply-btn">ນຳໃຊ້</button>
                    <button onClick={handleResetMultiplier} className="sw-reset-btn">ຣີເຊັດ</button>
                </div>
                <p>ຈຳນວນໃນວົງລໍ້: {wheelNames.length}</p>
            </div>

            <div className="sw-names-list">
              <h3>ລາຍຊື່ຫຼັກ ({masterNames.length})</h3>
              <ul>
                {masterNames.map((name, index) => (
                  <li key={index}>
                    {editingIndex === index ? (
                      <div className='sw-edit-group'>
                          <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()} autoFocus/>
                          <button onClick={handleSaveEdit} className='sw-save-btn'>ບັນທຶກ</button>
                          <button onClick={() => setEditingIndex(null)} className='sw-cancel-btn'>ຍົກເລີກ</button>
                      </div>
                    ) : (
                      <>
                        <span>{name}</span>
                        <div className='sw-item-buttons'>
                          <button onClick={() => handleEdit(index, name)} className='sw-edit-btn'>ແກ້ໄຂ</button>
                          <button onClick={() => handleRemoveName(index)} className='sw-remove-btn'>&times;</button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="sw-modal-overlay">
            <div className="sw-modal-content">
                <button onClick={closeModal} className="sw-modal-close-btn">&times;</button>
                <h3>ຂໍສະແດງຄວາມຍິນດີກັບ</h3>
                <p className="sw-winner-name">{winner}</p>
                <div className="sw-winner-actions">
                    <button onClick={closeModal}>ເກັບຜູ້ຊະນະໄວ້</button>
                    <button onClick={handleRemoveWinner} className="sw-remove-winner-btn">ເອົາຜູ້ຊະນະອອກ</button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default SpinWheelGame;
