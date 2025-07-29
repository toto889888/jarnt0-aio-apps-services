import React, { useState, useEffect, useRef } from 'react';
import './SpinWheelGame.css';

const SpinWheelGame = () => {
  const [options, setOptions] = useState([]); // options: Array<string>
  const [optionInput, setOptionInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [removeAfterSpin, setRemoveAfterSpin] = useState(false);
  const wheelRef = useRef(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  // Load options from localStorage on component mount
  useEffect(() => {
    const storedOptions = localStorage.getItem('spinWheelOptions');
    if (storedOptions) {
      setOptions(JSON.parse(storedOptions));
    }
  }, []);

  // Save options to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('spinWheelOptions', JSON.stringify(options));
  }, [options]);

  const handleAddOrUpdateOption = () => {
    if (optionInput.trim() === '') {
      alert('Please enter an option!');
      return;
    }

    if (editIndex !== null) {
      const updatedOptions = [...options];
      updatedOptions[editIndex] = optionInput.trim();
      setOptions(updatedOptions);
      setEditIndex(null);
    } else {
      setOptions([...options, optionInput.trim()]);
    }
    setOptionInput('');
  };

  const handleEditOption = (index) => {
    setOptionInput(options[index]);
    setEditIndex(index);
  };

  const handleRemoveOption = (indexToRemove) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
    if (editIndex === indexToRemove) {
      setEditIndex(null);
      setOptionInput('');
    }
  };

  const handleClearAllOptions = () => {
    if (window.confirm('Are you sure you want to clear all options?')) {
      setOptions([]);
      setOptionInput('');
      setEditIndex(null);
      setResult(null);
    }
  };

  const handleSpin = () => {
    if (options.length === 0) {
      alert('Please add some options first!');
      return;
    }
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const numberOfOptions = options.length;
    const degreesPerOption = 360 / numberOfOptions;
    const randomOptionIndex = Math.floor(Math.random() * numberOfOptions);

    const targetRotation = currentRotation + (360 * 5) + (randomOptionIndex * degreesPerOption) + (Math.random() * degreesPerOption);

    if (wheelRef.current) {
      wheelRef.current.style.transition = 'all 5s ease-out';
      wheelRef.current.style.transform = `rotate(${targetRotation}deg)`;

      setTimeout(() => {
        setSpinning(false);
        setResult(options[randomOptionIndex]);

        if (removeAfterSpin) {
          const updatedOptions = options.filter((_, index) => index !== randomOptionIndex);
          setOptions(updatedOptions);
        }
        setCurrentRotation(targetRotation % 360);
        wheelRef.current.style.transition = 'none';
        wheelRef.current.style.transform = `rotate(${targetRotation % 360}deg)`;
      }, 5000);
    }
  };

  const handleClearResult = () => {
    setResult(null);
  };

  return (
    <div className="spin-wheel-container">
      <h2>ເກມວົງລໍ້ສຸ່ມ</h2>

      <div className="options-management">
        <h3>ຈັດການຕົວເລືອກ</h3>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder={editIndex !== null ? "ແກ້ໄຂຕົວເລືອກ..." : "ເພີ່ມຕົວເລືອກໃໝ່..."}
            value={optionInput}
            onChange={(e) => setOptionInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddOrUpdateOption();
              }
            }}
          />
          <button className="btn btn-primary" onClick={handleAddOrUpdateOption}>
            {editIndex !== null ? 'ອັບເດດ' : 'ເພີ່ມ'}
          </button>
        </div>
        {options.length > 0 && (
          <ul className="list-group mb-3">
            {options.map((option, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{option}</span>
                <div>
                  <button className="btn btn-info btn-sm me-2" onClick={() => handleEditOption(index)}>
                    ແກ້ໄຂ
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveOption(index)}>
                    ລົບ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {options.length > 0 && (
          <button className="btn btn-warning w-100" onClick={handleClearAllOptions}>
            ລ້າງທັງໝົດ
          </button>
        )}
        <div className="form-check mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="removeAfterSpinCheck"
            checked={removeAfterSpin}
            onChange={(e) => setRemoveAfterSpin(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="removeAfterSpinCheck">
            ລົບຕົວເລືອກທີ່ສຸ່ມໄດ້ອອກຫຼັງຈາກໝຸນ
          </label>
        </div>
      </div>

      <div className="wheel-section">
        <div className="wheel-wrapper">
          <div className="wheel-pointer"></div>
          <div className="wheel" ref={wheelRef}>
            {options.length > 0 ? (
              options.map((option, index) => {
                const segmentAngle = 360 / options.length;
                const skewAngle = 90 - segmentAngle;
                const rotation = index * segmentAngle;
                const backgroundColor = `hsl(${index * (360 / options.length)}, 70%, 60%)`;

                return (
                  <div
                    key={index}
                    className="wheel-segment"
                    style={{
                      transform: `rotate(${rotation}deg) skewY(${skewAngle}deg)`,
                      backgroundColor: backgroundColor,
                    }}
                  >
                    <span
                      className="segment-text"
                      style={{
                        transform: `skewY(${-skewAngle}deg) rotate(${segmentAngle / 2}deg)`,
                      }}
                    >
                      {option}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="no-options-placeholder">ເພີ່ມຕົວເລືອກເພື່ອເລີ່ມ</div>
            )}
          </div>
        </div>
        <button className="btn btn-success btn-lg mt-4" onClick={handleSpin} disabled={spinning}>
          {spinning ? 'ກຳລັງໝຸນ...' : 'ສະປິນ!'}
        </button>
      </div>

      {result && (
        <div className="result-overlay">
          <div className="result-modal">
            <h3>ຜົນລັບ:</h3>
            <p className="display-4 text-primary">{result}</p>
            <button className="btn btn-primary me-2" onClick={handleSpin}>ສະປິນຊ້ຳ</button>
            <button className="btn btn-secondary" onClick={handleClearResult}>ລ້າງຜົນລັບ</button>
          </div>
        </div>
      )}

      </div>
  );
};

export default SpinWheelGame;
