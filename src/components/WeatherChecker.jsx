import React, { useEffect, useState } from 'react';

const API_KEY = 'a1cea39b48743946514ec9c3d61d6e71'; // Replace with your actual OpenWeatherMap API key

function WeatherChecker() {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric'); // metric = C, imperial = F

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('ບໍ່ຮອງຮັບ Geolocation.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setError('');
      },
      // eslint-disable-next-line no-unused-vars
      err => {
        setError('ບໍ່ໄດ້ຮັບອະນຸຍາດສະຖານທີ່.');
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=${unit}`)
      .then(res => res.json())
      .then(data => {
        if (data.cod !== 200) throw new Error(data.message);
        setWeather(data);
        setLoading(false);
      })
      // eslint-disable-next-line no-unused-vars
      .catch(e => {
        setError('ບໍ່ສາມາດດຶງຂໍ້ມູນສະພາບອາກາດໄດ້.');
        setLoading(false);
      });
  }, [coords, unit]);

  return (
    <div className="card shadow-sm p-4 text-center">
      <h2 className="card-title mb-4">🌤️ ສະພາບອາກາດປັດຈຸບັນ</h2>
      {loading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">ກຳລັງໂຫຼດ...</span>
        </div>
      )}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {weather && !loading && !error && (
        <div className="weather-info">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="icon" className="me-3" />
            <div>
              <div className="display-4 fw-bold">
                {Math.round(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
                <button onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')} className="btn btn-sm btn-outline-secondary ms-2">
                  {unit === 'metric' ? '°F' : '°C'}
                </button>
              </div>
              <div className="lead text-muted text-capitalize">{weather.weather[0].description}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <p className="mb-1"><strong>ຄວາມຊຸ່ມຊື່ນ:</strong> {weather.main.humidity}%</p>
              <p className="mb-1"><strong>ລົມ:</strong> {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
            </div>
            <div className="col-md-6">
              {weather.rain && <p className="mb-1"><strong>ຝົນ:</strong> {weather.rain['1h'] || weather.rain['3h']} mm</p>}
              <p className="mb-1"><strong>ສະຖານທີ່:</strong> {weather.name}, {weather.sys.country}</p>
            </div>
          </div>
        </div>
      )}
      <div className="text-center text-muted mt-3">
        <small>Powered by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">OpenWeatherMap</a></small>
      </div>
    </div>
  );
}

export default WeatherChecker;
