import React, { useState, useEffect, useRef } from 'react';

const StopwatchTimer = () => {
  // Stopwatch State
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const stopwatchIntervalRef = useRef(null);

  // Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInput, setTimerInput] = useState(''); // Input in seconds
  const [timerTime, setTimerTime] = useState(0); // Current time in seconds
  const timerIntervalRef = useRef(null);
  const timerAudioRef = useRef(null);

  // --- Stopwatch Logic ---
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchTime((prevTime) => prevTime + 10); // Update every 10ms
      }, 10);
    } else {
      clearInterval(stopwatchIntervalRef.current);
    }
    return () => clearInterval(stopwatchIntervalRef.current);
  }, [stopwatchRunning]);

  const startStopwatch = () => {
    setStopwatchRunning(true);
  };

  const stopStopwatch = () => {
    setStopwatchRunning(false);
  };

  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
  };

  const formatStopwatchTime = (time) => {
    const milliseconds = `0${Math.floor((time % 1000) / 10)}`.slice(-2);
    const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
    const minutes = `0${Math.floor((time / (1000 * 60)) % 60)}`.slice(-2);
    const hours = `0${Math.floor(time / (1000 * 60 * 60))}`.slice(-2);
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  // --- Timer Logic ---
  useEffect(() => {
    if (timerRunning && timerTime > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timerTime === 0 && timerRunning) {
      setTimerRunning(false);
      clearInterval(timerIntervalRef.current);
      // Play sound
      if (timerAudioRef.current) {
        timerAudioRef.current.play();
      }
      // Show notification
      if (window.Notification && Notification.permission === 'granted') {
        new Notification('⏰ Timer Finished!', {
          body: 'Your timer has ended.',
          icon: '/vite.svg', // You can use a custom icon here
        });
      } else if (window.Notification && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('⏰ Timer Finished!', {
              body: 'Your timer has ended.',
              icon: '/vite.svg',
            });
          }
        });
      }
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerRunning, timerTime]);

  const handleTimerInputChange = (e) => {
    setTimerInput(e.target.value);
  };

  const setTimer = () => {
    const seconds = parseInt(timerInput, 10);
    if (!isNaN(seconds) && seconds > 0) {
      setTimerTime(seconds);
      setTimerRunning(false); // Reset running state when setting new time
    } else {
      alert('ກະລຸນາປ້ອນເວລາທີ່ຖືກຕ້ອງ (ເປັນວິນາທີ)');
    }
  };

  const startTimer = () => {
    if (timerTime > 0) {
      setTimerRunning(true);
    } else {
      alert('ກະລຸນາຕັ້ງເວລາສຳລັບ Timer ກ່ອນ');
    }
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerTime(0);
    setTimerInput('');
    if (timerAudioRef.current) {
      timerAudioRef.current.pause();
      timerAudioRef.current.currentTime = 0;
    }
  };

  const formatTimerTime = (time) => {
    const hours = `0${Math.floor(time / 3600)}`.slice(-2);
    const minutes = `0${Math.floor((time % 3600) / 60)}`.slice(-2);
    const seconds = `0${time % 60}`.slice(-2);
    return `${hours}:${minutes}:${seconds}`;
  };

  // Request Notification permission on mount
  useEffect(() => {
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">ເຄື່ອງມືຈັບເວລາ / ນັບຖອຍຫຼັງ</h2>

      <div className="row">
        {/* Stopwatch Section */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h4 className="card-title mb-4">ໂມງຈັບເວລາ</h4>
              <div className="display-4 fw-bold mb-4">
                {formatStopwatchTime(stopwatchTime)}
              </div>
              <div className="d-grid gap-2">
                {!stopwatchRunning ? (
                  <button className="btn btn-success btn-lg" onClick={startStopwatch}>
                    ເລີ່ມ
                  </button>
                ) : (
                  <button className="btn btn-warning btn-lg" onClick={stopStopwatch}>
                    ຢຸດ
                  </button>
                )}
                <button className="btn btn-danger btn-lg" onClick={resetStopwatch}>
                  ຣີເຊັດ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h4 className="card-title mb-4">ເຄື່ອງຈັບເວລາ</h4>
              <div className="mb-3">
                <label htmlFor="timerInput" className="form-label">ຕັ້ງເວລາ (ວິນາທີ):</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control form-control-lg text-center"
                    id="timerInput"
                    value={timerInput}
                    onChange={handleTimerInputChange}
                    placeholder="ເຊັ່ນ 60 (1 ນາທີ)"
                    min="0"
                  />
                  <button className="btn btn-primary" onClick={setTimer}>ຕັ້ງຄ່າ</button>
                </div>
              </div>
              <div className="display-4 fw-bold mb-4">
                {formatTimerTime(timerTime)}
              </div>
              <div className="d-grid gap-2">
                {!timerRunning && timerTime === 0 ? (
                  <button className="btn btn-success btn-lg" onClick={startTimer} disabled={timerTime === 0}>
                    ເລີ່ມ
                  </button>
                ) : !timerRunning && timerTime > 0 ? (
                  <button className="btn btn-success btn-lg" onClick={startTimer}>
                    ເລີ່ມ
                  </button>
                ) : (
                  <button className="btn btn-warning btn-lg" onClick={stopTimer}>
                    ຢຸດ
                  </button>
                )}
                <button className="btn btn-danger btn-lg" onClick={resetTimer}>
                  ຣີເຊັດ
                </button>
              </div>
              <audio ref={timerAudioRef} src="https://www.soundjay.com/buttons/beep-07.mp3" preload="auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopwatchTimer;
