import React, { useState } from 'react';

function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm'); // cm, ft, in
  const [weightUnit, setWeightUnit] = useState('kg'); // kg, lbs
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState('');

  const calculateBMI = () => {
    let h = parseFloat(height);
    let w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setBmi(null);
      setStatus('ກະລຸນາປ້ອນຄ່າທີ່ຖືກຕ້ອງ');
      return;
    }

    // Convert height to meters
    if (heightUnit === 'cm') {
      h = h / 100; // cm to meters
    } else if (heightUnit === 'ft') {
      h = h * 0.3048; // feet to meters
    } else if (heightUnit === 'in') {
      h = h * 0.0254; // inches to meters
    }

    // Convert weight to kilograms
    if (weightUnit === 'lbs') {
      w = w * 0.453592; // lbs to kg
    }

    const calculatedBmi = w / (h * h);
    setBmi(calculatedBmi.toFixed(2));

    if (calculatedBmi < 18.5) {
      setStatus('ນ້ຳໜັກໜ້ອຍ');
    } else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) {
      setStatus('ນ້ຳໜັກປົກກະຕິ');
    } else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) {
      setStatus('ນ້ຳໜັກເກີນ');
    } else {
      setStatus('ຕຸ້ຍ');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">ເຄື່ອງຄິດໄລ່ BMI</h2>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="heightInput" className="form-label">ລວງສູງ</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              id="heightInput"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="ລວງສູງ"
            />
            <select
              className="form-select"
              value={heightUnit}
              onChange={(e) => setHeightUnit(e.target.value)}
            >
              <option value="cm">ຊັງຕີແມັດ</option>
              <option value="ft">ຟຸດ</option>
              <option value="in">ນິ້ວ</option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="weightInput" className="form-label">ນ້ຳໜັກ</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              id="weightInput"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="ນ້ຳໜັກ"
            />
            <select
              className="form-select"
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
            >
              <option value="kg">ກິໂລກຣາມ</option>
              <option value="lbs">ປອນ</option>
            </select>
          </div>
        </div>
      </div>
      <button className="btn btn-primary" onClick={calculateBMI}>ຄິດໄລ່ BMI</button>

      {bmi && (
        <div className="mt-4 p-3 border rounded">
          <h3>ຜົນໄດ້ຮັບ:</h3>
          <p className="fs-4">ຄ່າ BMI ຂອງທ່ານ: <strong>{bmi}</strong></p>
          <p className="fs-4">ສະຖານະ: <strong>{status}</strong></p>
        </div>
      )}
      {!bmi && status && (
        <div className="mt-4 p-3 border rounded alert alert-warning">
          <p className="fs-4">{status}</p>
        </div>
      )}
    </div>
  );
}

export default BMICalculator;
