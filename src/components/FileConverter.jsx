import React, { useRef, useState } from 'react';

const FORMATS = [
  { ext: 'png', label: 'PNG' },
  { ext: 'jpg', label: 'JPG' },
  { ext: 'webp', label: 'WebP' },
  { ext: 'bmp', label: 'BMP' },
  { ext: 'gif', label: 'GIF' },
];

function FileConverter() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState('png');
  const [outputUrl, setOutputUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef();

  const handleFile = f => {
    setFile(f);
    setOutputUrl('');
    setProgress(0);
  };
  const handleDrop = e => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };
  const handleConvert = () => {
    if (!file) return;
    setProgress(10);
    const reader = new FileReader();
    reader.onload = e => {
      const img = new window.Image();
      img.onload = () => {
        setProgress(60);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        setProgress(90);
        let mime = 'image/png';
        if (target === 'jpg') mime = 'image/jpeg';
        if (target === 'webp') mime = 'image/webp';
        if (target === 'bmp') mime = 'image/bmp';
        if (target === 'gif') mime = 'image/gif';
        canvas.toBlob(blob => {
          setOutputUrl(URL.createObjectURL(blob));
          setProgress(100);
        }, mime);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `converted.${target}`;
    a.click();
  };

  return (
    <div className="card shadow-sm p-4">
      <h2 className="card-title text-center mb-4">🖼️ ເຄື່ອງແປງໄຟລ໌ (ຮູບພາບ)</h2>
      <div
        className="form-control text-center py-4 mb-3 border-dashed"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current.click()}
        style={{ cursor: 'pointer' }}
      >
        {file ? file.name : 'ລາກ & ວາງ ຫຼື ຄລິກເພື່ອອັບໂຫຼດຮູບພາບ'}
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
          <div className="input-group mb-3">
            <label className="input-group-text">ແປງເປັນ:</label>
            <select className="form-select" value={target} onChange={e => setTarget(e.target.value)}>
              {FORMATS.map(f => (
                <option key={f.ext} value={f.ext}>{f.label}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleConvert}>ແປງ</button>
          </div>
          <div className="mt-3">
            {progress > 0 && progress < 100 && (
              <div className="progress mb-3">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            )}
            {progress === 100 && outputUrl && (
              <button className="btn btn-success w-100" onClick={handleDownload}>ດາວໂຫຼດໄຟລ໌ທີ່ແປງແລ້ວ</button>
            )}
          </div>
          {outputUrl && (
            <div className="mt-3 text-center">
              <h5>ສະແດງຕົວຢ່າງ:</h5>
              <img src={outputUrl} alt="Converted" className="img-fluid rounded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileConverter;
