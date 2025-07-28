import React, { useState } from 'react';

const UNITS = {
  length: [
    { code: 'mm', label: 'Millimeter', factor: 0.001 },
    { code: 'cm', label: 'Centimeter', factor: 0.01 },
    { code: 'm', label: 'Meter', factor: 1 },
    { code: 'km', label: 'Kilometer', factor: 1000 },
    { code: 'in', label: 'Inch', factor: 0.0254 },
    { code: 'ft', label: 'Foot', factor: 0.3048 },
    { code: 'yd', label: 'Yard', factor: 0.9144 },
    { code: 'mi', label: 'Mile', factor: 1609.34 },
  ],
  height: [
    { code: 'mm', label: 'Millimeter', factor: 0.001 },
    { code: 'cm', label: 'Centimeter', factor: 0.01 },
    { code: 'm', label: 'Meter', factor: 1 },
    { code: 'ft', label: 'Foot', factor: 0.3048 },
    { code: 'in', label: 'Inch', factor: 0.0254 },
  ],
  weight: [
    { code: 'mg', label: 'Milligram', factor: 0.000001 },
    { code: 'g', label: 'Gram', factor: 0.001 },
    { code: 'kg', label: 'Kilogram', factor: 1 },
    { code: 't', label: 'Tonne', factor: 1000 },
    { code: 'oz', label: 'Ounce', factor: 0.0283495 },
    { code: 'lb', label: 'Pound', factor: 0.453592 },
  ],
  temperature: [
    { code: 'C', label: 'Celsius' },
    { code: 'F', label: 'Fahrenheit' },
    { code: 'K', label: 'Kelvin' },
  ],
};

function convertUnit(type, from, to, value) {
  if (type === 'temperature') {
    if (from === to) return value;
    if (from === 'C') return to === 'F' ? value * 9/5 + 32 : value + 273.15;
    if (from === 'F') return to === 'C' ? (value - 32) * 5/9 : (value - 32) * 5/9 + 273.15;
    if (from === 'K') return to === 'C' ? value - 273.15 : (value - 273.15) * 9/5 + 32;
  } else {
    const fromF = UNITS[type].find(u => u.code === from)?.factor || 1;
    const toF = UNITS[type].find(u => u.code === to)?.factor || 1;
    return value * fromF / toF;
  }
}

function UnitConverter() {
  const [type, setType] = useState('length');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('km');
  const [value, setValue] = useState('1');
  const [result, setResult] = useState('');

  React.useEffect(() => {
    if (isNaN(parseFloat(value))) {
      setResult('');
      return;
    }
    const val = parseFloat(value);
    setResult(convertUnit(type, from, to, val));
  }, [type, from, to, value]);

  return (
    <div className="card shadow-sm p-4">
      <h2 className="card-title text-center mb-4">🔄 ເຄື່ອງແປງໜ່ວຍ</h2>
      <form onSubmit={e => e.preventDefault()}>
        <div className="mb-3">
          <label htmlFor="unitType" className="form-label">ປະເພດ</label>
          <select
            id="unitType"
            className="form-select"
            value={type}
            onChange={e => {
              setType(e.target.value);
              setFrom(UNITS[e.target.value][0].code);
              setTo(UNITS[e.target.value][1].code);
            }}
          >
            <option value="length">ຄວາມຍາວ</option>
            <option value="height">ຄວາມສູງ (ສຳລັບຄົນ)</option>
            <option value="weight">ນ້ຳໜັກ</option>
            <option value="temperature">ອຸນຫະພູມ</option>
          </select>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label htmlFor="fromUnit" className="form-label">ຈາກ</label>
            <select id="fromUnit" className="form-select" value={from} onChange={e => setFrom(e.target.value)}>
              {UNITS[type].map(u => (
                <option key={u.code} value={u.code}>{u.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="toUnit" className="form-label">ເຖິງ</label>
            <select id="toUnit" className="form-select" value={to} onChange={e => setTo(e.target.value)}>
              {UNITS[type].map(u => (
                <option key={u.code} value={u.code}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="valueInput" className="form-label">ຄ່າ</label>
          <input
            type="number"
            id="valueInput"
            className="form-control form-control-lg"
            value={value}
            onChange={e => setValue(e.target.value)}
            min="-1000000"
            step="any"
          />
        </div>
      </form>
      <div className="text-center mt-4">
        {result !== '' && <h4 className="text-primary">{value} {from} = <b>{result}</b> {to}</h4>}
      </div>
      {type === 'height' && (
        <div className="text-center text-muted mt-3"><small>ຄວາມສູງ: ເໝາະກັບການແປງຄວາມສູງຂອງຄົນ (cm, m, ft, in ແລະອື່ນໆ)</small></div>
      )}
    </div>
  );
}

export default UnitConverter;
