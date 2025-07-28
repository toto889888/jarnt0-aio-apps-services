import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function QRCodeGenerator() {
  const [text, setText] = useState('');
  const qrRef = useRef();

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div className="card shadow-sm p-4 text-center">
      <h2 className="card-title mb-4">🔳 ເຄື່ອງສ້າງລະຫັດ QR</h2>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows={3}
          placeholder="ປ້ອນຂໍ້ຄວາມ, URL, ຫຼືຂໍ້ມູນ..."
          value={text}
          onChange={e => setText(e.target.value)}
          aria-label="QR Code content"
        />
      </div>
      <div ref={qrRef} className="mb-3">
        {text && <QRCodeCanvas value={text} size={220} className="img-fluid rounded" />}
      </div>
      {text && (
        <button className="btn btn-primary w-100" onClick={downloadQR}>ດາວໂຫຼດ PNG</button>
      )}
    </div>
  );
}

export default QRCodeGenerator;
