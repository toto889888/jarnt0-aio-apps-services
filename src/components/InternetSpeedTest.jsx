import React, { useState, useRef } from 'react';

const InternetSpeedTest = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [ping, setPing] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState('ພ້ອມສຳລັບການທົດສອບ');
  const testIntervalRef = useRef(null);

  const startTest = async () => {
    setIsTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setStatus('ກຳລັງທົດສອບ...');

    const backendUrl = 'http://localhost:5000'; // ตรวจสอบให้แน่ใจว่าตรงกับ port ของ backend

    try {
      // Ping Test
      setStatus('ກຳລັງທົດສອບ Ping...');
      const pingStartTime = performance.now();
      await fetch(`${backendUrl}/speedtest/ping`);
      const pingEndTime = performance.now();
      const calculatedPing = (pingEndTime - pingStartTime).toFixed(2);
      setPing(calculatedPing);

      // Download Speed Test
      setStatus('ກຳລັງທົດສອບ Download Speed...');
      const downloadStartTime = performance.now();
      const downloadResponse = await fetch(`${backendUrl}/speedtest/download`);
      const downloadBlob = await downloadResponse.blob();
      const downloadEndTime = performance.now();
      const downloadSize = downloadBlob.size; // bytes
      const downloadDuration = (downloadEndTime - downloadStartTime) / 1000; // seconds
      const downloadSpeedMbps = ((downloadSize * 8) / (1000 * 1000)) / downloadDuration; // Mbps
      setDownloadSpeed(downloadSpeedMbps.toFixed(2));

      // Upload Speed Test
      setStatus('ກຳລັງທົດສອບ Upload Speed...');
      const uploadStartTime = performance.now();
      const uploadSize = 10 * 1024 * 1024; // 10 MB for upload test
      const uploadData = new Uint8Array(uploadSize).fill(0); // Create dummy data
      await fetch(`${backendUrl}/speedtest/upload`, {
        method: 'POST',
        body: uploadData,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
      const uploadEndTime = performance.now();
      const uploadDuration = (uploadEndTime - uploadStartTime) / 1000; // seconds
      const uploadSpeedMbps = ((uploadSize * 8) / (1000 * 1000)) / uploadDuration; // Mbps
      setUploadSpeed(uploadSpeedMbps.toFixed(2));

      setStatus('ການທົດສອບສຳເລັດ!');
    } catch (error) {
      console.error('Error during speed test:', error);
      setStatus('ເກີດຂໍ້ຜິດພາດໃນການທົດສອບ');
    } finally {
      setIsTesting(false);
    }
  };

  const stopTest = () => {
    // In a real scenario, you might need to abort ongoing fetch requests.
    // For simplicity, we just stop the UI update and reset status.
    setIsTesting(false);
    setStatus('ການທົດສອບຖືກຍົກເລີກ');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">ເຄື່ອງມືກວດສອບຄວາມໄວອິນເຕີເນັດ</h2>
      <div className="card p-4 shadow-sm text-center">
        <h3 className="mb-4">{status}</h3>
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-light p-3">
              <h5>Download Speed</h5>
              <p className="display-5 fw-bold">
                {downloadSpeed !== null ? `${downloadSpeed} Mbps` : '--'}
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light p-3">
              <h5>Upload Speed</h5>
              <p className="display-5 fw-bold">
                {uploadSpeed !== null ? `${uploadSpeed} Mbps` : '--'}
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light p-3">
              <h5>Ping</h5>
              <p className="display-5 fw-bold">
                {ping !== null ? `${ping} ms` : '--'}
              </p>
            </div>
          </div>
        </div>
        <div className="d-grid gap-2 col-6 mx-auto">
          {!isTesting ? (
            <button className="btn btn-primary btn-lg" onClick={startTest}>
              ເລີ່ມທົດສອບ
            </button>
          ) : (
            <button className="btn btn-danger btn-lg" onClick={stopTest}>
              ຢຸດທົດສອບ
            </button>
          )}
        </div>
      </div>

      </div>
  );
};

export default InternetSpeedTest;
