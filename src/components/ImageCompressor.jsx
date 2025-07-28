import React, { useRef, useState } from 'react';

function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [outputSize, setOutputSize] = useState(0);
  const inputRef = useRef();

  const handleFile = f => {
    setFile(f);
    setOutputUrl('');
    setOutputSize(0);
  };
  const handleCompress = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new window.Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (width) w = parseInt(width);
        if (height) h = parseInt(height);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(blob => {
          setOutputUrl(URL.createObjectURL(blob));
          setOutputSize(blob.size);
        }, 'image/jpeg', quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = 'compressed.jpg';
    a.click();
  };

  return (
    <div className="card shadow-sm p-4">
      <h2 className="card-title text-center mb-4">🗜️ ເຄື່ອງບີບອັດ ແລະ ປັບຂະໜາດຮູບພາບ</h2>
      <div
        className="form-control text-center py-4 mb-3 border-dashed"
        onClick={() => inputRef.current.click()}
        style={{ cursor: 'pointer' }}
      >
        {file ? file.name : 'ຄລິກເພື່ອອັບໂຫຼດຮູບພາບ'}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={inputRef}
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>
      {file && (
        <div className="mt-3">
          <div className="mb-3">
            <label htmlFor="qualityRange" className="form-label">ຄຸນນະພາບ: {Math.round(quality * 100)}%</label>
            <input
              type="range"
              className="form-range"
              id="qualityRange"
              min="0.1"
              max="1"
              step="0.01"
              value={quality}
              onChange={e => setQuality(Number(e.target.value))}
            />
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="widthInput" className="form-label">ຄວາມກວ້າງ:</label>
              <input
                type="number"
                id="widthInput"
                className="form-control"
                value={width}
                onChange={e => setWidth(e.target.value)}
                placeholder="ອັດຕະໂນມັດ"
                min="1"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="heightInput" className="form-label">ຄວາມສູງ:</label>
              <input
                type="number"
                id="heightInput"
                className="form-control"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="ອັດຕະໂນມັດ"
                min="1"
              />
            </div>
          </div>
          <button className="btn btn-primary w-100 mb-3" onClick={handleCompress}>ບີບອັດ/ປັບຂະໜາດ</button>
          {outputUrl && (
            <div className="text-center mt-3">
              <h5>ຮູບພາບທີ່ຖືກບີບອັດ:</h5>
              <img src={outputUrl} alt="Compressed" className="img-fluid rounded mb-3" style={{ maxWidth: '100%', maxHeight: '300px' }} />
              <p>ຂະໜາດ: {outputSize ? (outputSize / 1024).toFixed(2) : ''} KB</p>
              <button className="btn btn-success w-100" onClick={handleDownload}>ດາວໂຫຼດຮູບພາບທີ່ຖືກບີບອັດ</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageCompressor;
