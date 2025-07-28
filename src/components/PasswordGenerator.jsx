import React, { useState } from 'react';

function randomPassword(len, opts) {
  let chars = '';
  if (opts.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (opts.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (opts.number) chars += '0123456789';
  if (opts.symbol) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  let pass = '';
  for (let i = 0; i < len; ++i) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [opts, setOpts] = useState({ lower: true, upper: true, number: true, symbol: false });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setPassword(randomPassword(length, opts));
    setCopied(false);
  };
  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
  };

  return (
    <div className="card shadow-sm p-4">
      <h2 className="card-title text-center mb-4">🔐 ເຄື່ອງສ້າງລະຫັດຜ່ານ</h2>
      <div className="mb-3">
        <label htmlFor="passwordLength" className="form-label">ຄວາມຍາວລະຫັດຜ່ານ: {length}</label>
        <input
          type="range"
          className="form-range"
          id="passwordLength"
          min="8"
          max="32"
          value={length}
          onChange={e => setLength(Number(e.target.value))}
        />
      </div>
      <div className="row mb-3">
        <div className="col-6 col-md-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="lowerCase"
              checked={opts.lower}
              onChange={e => setOpts({ ...opts, lower: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="lowerCase">a-z</label>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="upperCase"
              checked={opts.upper}
              onChange={e => setOpts({ ...opts, upper: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="upperCase">A-Z</label>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="numbers"
              checked={opts.number}
              onChange={e => setOpts({ ...opts, number: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="numbers">0-9</label>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="symbols"
              checked={opts.symbol}
              onChange={e => setOpts({ ...opts, symbol: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="symbols">ສັນຍາລັກ</label>
          </div>
        </div>
      </div>
      <button className="btn btn-primary w-100 mb-3" onClick={generate}>ສ້າງລະຫັດຜ່ານ</button>
      <div className="input-group">
        <input type="text" className="form-control" value={password} readOnly placeholder="ລະຫັດຜ່ານຂອງທ່ານຈະປາກົດຢູ່ທີ່ນີ້" />
        <button className="btn btn-outline-secondary" onClick={copy} disabled={!password}>
          {copied ? 'ສຳເນົາແລ້ວ!' : 'ສຳເນົາ'}
        </button>
      </div>
    </div>
  );
}

export default PasswordGenerator;
