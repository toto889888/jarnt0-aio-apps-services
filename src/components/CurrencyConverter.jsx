import React, { useEffect, useState } from 'react';


const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'LAK', name: 'Lao Kip' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'VND', name: 'Vietnamese Dong' },
  { code: 'INR', name: 'Indian Rupee' },
];

function CurrencyConverter() {
  const [from, setFrom] = useState('THB');
  const [to, setTo] = useState('LAK');
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState('');
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`https://open.er-api.com/v6/latest/${from}`)
      .then(res => res.json())
      .then(data => {
        if (data.result === 'error') throw new Error(data['error-type']);
        setRates(data.rates);
        setLoading(false);
      })
      .catch(e => {
        setError(`Failed to fetch rates: ${e.message}`);
        setLoading(false);
      });
  }, [from]);

  useEffect(() => {
    if (!rates[to] || isNaN(parseFloat(amount))) {
      setResult('');
      return;
    }
    const amt = parseFloat(amount);
    setResult((amt * rates[to]).toLocaleString(undefined, { maximumFractionDigits: 6 }));
  }, [amount, to, rates]);

  const filteredFrom = CURRENCIES.filter(c => c.code.toLowerCase().includes(searchFrom.toLowerCase()) || c.name.toLowerCase().includes(searchFrom.toLowerCase()));
  const filteredTo = CURRENCIES.filter(c => c.code.toLowerCase().includes(searchTo.toLowerCase()) || c.name.toLowerCase().includes(searchTo.toLowerCase()));

  return (
    <div className="card shadow-sm p-4">
      <h2 className="card-title text-center mb-4">💱 ເຄື່ອງແປງສະກຸນເງິນແບບ Real-time</h2>
      <form className="mb-4" onSubmit={e => e.preventDefault()}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label htmlFor="fromCurrency" className="form-label">ຈາກ</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="ຄົ້ນຫາ..."
                value={searchFrom}
                onChange={e => setSearchFrom(e.target.value)}
              />
              <select
                id="fromCurrency"
                className="form-select"
                value={from}
                onChange={e => setFrom(e.target.value)}
              >
                {filteredFrom.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="toCurrency" className="form-label">ເຖິງ</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="ຄົ້ນຫາ..."
                value={searchTo}
                onChange={e => setSearchTo(e.target.value)}
              />
              <select
                id="toCurrency"
                className="form-select"
                value={to}
                onChange={e => setTo(e.target.value)}
              >
                {filteredTo.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">ຈຳນວນ</label>
          <input
            type="number"
            id="amount"
            className="form-control form-control-lg"
            min="0"
            step="any"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
      </form>
      <div className="text-center mb-3">
        {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">ກຳລັງໂຫຼດ...</span></div>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {!loading && !error && result && (
          <h4 className="text-success">{amount} {from} = <b>{result} {to}</b></h4>
        )}
      </div>
      <div className="text-center text-muted">
        <small>Rates by <a href="https://exchangerate.host/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">exchangerate.host</a></small>
      </div>
    </div>
  );
}

export default CurrencyConverter;
