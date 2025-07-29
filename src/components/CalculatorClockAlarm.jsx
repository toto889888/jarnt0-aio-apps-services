import React, { useEffect, useState, useRef } from 'react';

function formatTime(date) {
  return date.toLocaleTimeString('en-GB', { hour12: false });
}
function formatDate(date) {
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
}

function evaluateExpression(expression) {
  // Basic validation: only allow numbers, +, -, *, /
  if (!/^[0-9+\-*\/.]+$/.test(expression)) {
    throw new Error('Invalid expression');
  }

  const operators = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => {
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    }
  };

  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
  };

  const outputQueue = [];
  const operatorStack = [];

  const tokens = expression.match(/(\d+\.?\d*)|([+\-*\/])/g);

  if (!tokens) {
    return 0;
  }

  for (const token of tokens) {
    if (!isNaN(parseFloat(token))) {
      outputQueue.push(parseFloat(token));
    } else if (operators[token]) {
      while (
        operatorStack.length > 0 &&
        operators[operatorStack[operatorStack.length - 1]] &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    } else {
      throw new Error('Invalid token: ' + token);
    }
  }

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
  }

  const evaluationStack = [];
  for (const token of outputQueue) {
    if (!isNaN(token)) {
      evaluationStack.push(token);
    } else if (operators[token]) {
      const b = evaluationStack.pop();
      const a = evaluationStack.pop();
      if (a === undefined || b === undefined) {
        throw new Error('Invalid expression format');
      }
      evaluationStack.push(operators[token](a, b));
    }
  }

  if (evaluationStack.length !== 1) {
    throw new Error('Invalid expression format');
  }

  return evaluationStack[0];
}

const BUTTONS = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
  ['C', '⌫'],
];

function getAlarmsFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('alarms')) || [];
  } catch {
    return [];
  }
}

function CalculatorClockAlarm() {
  const [now, setNow] = useState(new Date());
  const [calc, setCalc] = useState('');
  const [result, setResult] = useState('0');
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('calc-history')) || [];
    } catch {
      return [];
    }
  });
  const [alarms, setAlarms] = useState(getAlarmsFromStorage);
  const [alarmInput, setAlarmInput] = useState('');
  const [alarmRinging, setAlarmRinging] = useState(null); // {time, id}
  const alarmAudio = useRef(null);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('calc-history', JSON.stringify(history));
  }, [history]);

  // Save alarms to localStorage
  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Alarm check
  useEffect(() => {
    if (alarmRinging) return; // Don't check if already ringing
    const nowStr = now.toTimeString().slice(0,5);
    const found = alarms.find(a => a.time === nowStr && !a.rangToday);
    if (found) {
      setAlarmRinging(found);
      // Mark as rang today
      setAlarms(alarms.map(a => a.id === found.id ? { ...a, rangToday: true } : a));
      // Notification
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('⏰ Alarm', { body: `It's ${found.time}` });
        });
      }
      // Play sound
      if (alarmAudio.current) {
        alarmAudio.current.play();
      }
    }
    // Reset rangToday at midnight
    if (nowStr === '00:00') {
      setAlarms(alarms.map(a => ({ ...a, rangToday: false })));
    }
  }, [now, alarms, alarmRinging]);

  // Request Notification permission on mount
  useEffect(() => {
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Calculator logic
  const handleButton = (val) => {
    if (val === 'C') {
      setCalc('');
      setResult('0');
    } else if (val === '⌫') {
      setCalc(calc.slice(0, -1));
    } else if (val === '=') {
      try {
        const evalResult = evaluateExpression(calc).toString();
        setResult(evalResult);
        setHistory([{ exp: calc, res: evalResult }, ...history].slice(0, 20));
        setCalc('');
      } catch {
        setResult('Error');
      }
    } else {
      setCalc(calc + val);
    }
  };

  // Alarm logic
  const handleAlarmSubmit = (e) => {
    e.preventDefault();
    if (!alarmInput) return;
    if (alarms.some(a => a.time === alarmInput)) return;
    setAlarms([
      ...alarms,
      { id: Date.now(), time: alarmInput, rangToday: false }
    ]);
    setAlarmInput('');
  };
  const handleDeleteAlarm = (id) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };
  const handleStopAlarm = () => {
    setAlarmRinging(null);
    if (alarmAudio.current) {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
    }
  };

  return (
    <div className="row g-4">
      {/* Clock Section */}
      <div className="col-md-6 col-lg-6">
        <div className="card shadow-sm h-100">
          <div className="card-body text-center">
            <h5 className="card-title mb-3">🕒 ໂມງ ແລະ ວັນທີ</h5>
            <div className="display-4 fw-bold mb-2" data-testid="clock-display">{formatTime(now)}</div>
            <div className="lead text-muted" data-testid="date-display">{formatDate(now)}</div>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="col-md-6 col-lg-6">
        <div className="card shadow-sm h-100">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title mb-3 text-center">🧮 ເຄື່ອງຄິດໄລ່</h5>
            <div className="form-control form-control-lg text-end mb-3" style={{ height: '60px', fontSize: '1.8rem' }} data-testid="calc-display">
              {calc || result}
            </div>
            <div className="">
              {BUTTONS.map((row, i) => (
                <div key={i} className="row gx-2 mb-2">
                  {row.map((btn) => (
                    <div
                      key={btn}
                      className={
                        row.length === 4 ? "col-3" :
                        row.length === 2 ? "col-6" :
                        "col"
                      }
                    >
                      <button
                        onClick={() => handleButton(btn)}
                        className={`btn btn-outline-primary w-100 ${btn === '=' ? 'btn-primary text-white' : ''}`}
                        style={{ height: '60px' }}
                        data-testid={`btn-${btn}`}>
                        {btn}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alarm Section */}
      <div className="col-md-6 col-lg-6">
        <div className="card shadow-sm h-100">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title mb-3 text-center">⏰ ໂມງປຸກ</h5>
            <form onSubmit={handleAlarmSubmit} className="mb-3">
              <div className="input-group">
                <input
                  type="time"
                  className="form-control"
                  value={alarmInput}
                  onChange={e => setAlarmInput(e.target.value)}
                  required
                  data-testid="alarm-input"
                />
                <button type="submit" className="btn btn-primary" data-testid="set-alarm-btn">ຕັ້ງຄ່າ</button>
              </div>
            </form>
            <div className="alarm-list flex-grow-1 overflow-auto" style={{ maxHeight: '200px' }} data-testid="alarm-list">
              {alarms.length === 0 && <div className="text-muted text-center">ບໍ່ມີໂມງປຸກທີ່ຕັ້ງໄວ້.</div>}
              <ul className="list-group list-group-flush">
                {alarms.map(a => (
                  <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center" data-testid={`alarm-item-${a.id}`}>
                    <span>{a.time}</span>
                    <button onClick={() => handleDeleteAlarm(a.id)} className="btn btn-sm btn-outline-danger" title="Delete" data-testid={`delete-alarm-btn-${a.id}`}>
                      <i className="bi bi-trash"></i> 🗑️
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {alarmRinging && (
              <div className="alert alert-danger mt-3 text-center" data-testid="alarm-popup">
                <div>⏰ ໂມງປຸກ! {alarmRinging.time}</div>
                <button onClick={handleStopAlarm} className="btn btn-danger mt-2" data-testid="stop-alarm-btn">ຢຸດ</button>
              </div>
            )}
            <audio ref={alarmAudio} src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae3c7.mp3" preload="auto" />
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="col-md-6 col-lg-6">
        <div className="card shadow-sm h-100">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title mb-3 text-center">📝 ປະຫວັດການຄິດໄລ່</h5>
            <div className="history-list flex-grow-1 overflow-auto" style={{ maxHeight: '300px' }}>
              {history.length === 0 && <div className="text-muted text-center">ຍັງບໍ່ມີປະຫວັດ.</div>}
              <ul className="list-group list-group-flush">
                {history.map((h, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{h.exp} = </span>
                    <b>{h.res}</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalculatorClockAlarm;