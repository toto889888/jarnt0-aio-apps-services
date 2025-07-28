import React, { useState, useEffect } from 'react';

function Notepad() {
  const [text, setText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('notepad');
    if (saved) setText(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem('notepad', text);
  }, [text]);

  return (
    <div className="card shadow-sm p-4">
      <h2 className="card-title text-center mb-4">🗒️ ປື້ມບັນທຶກ</h2>
      <textarea
        className="form-control"
        rows={10}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="ພິມບັນທຶກຂອງທ່ານທີ່ນີ້..."
        aria-label="Notepad content"
      />
    </div>
  );
}

export default Notepad;
