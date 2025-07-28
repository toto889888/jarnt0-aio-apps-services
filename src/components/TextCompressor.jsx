import React, { useState } from 'react';

const TextCompressor = () => {
  const [inputText, setInputText] = useState('');
  const [processedText, setProcessedText] = useState('');

  const processText = (text) => {
    let result = text;

    // Remove extra spaces
    result = result.replace(/\s+/g, ' ').trim();

    // Remove empty lines
    result = result.split('\n').filter(line => line.trim() !== '').join('\n');

    // Remove duplicate lines (keep unique lines)
    const lines = result.split('\n');
    const uniqueLines = [];
    const seen = new Set();
    for (const line of lines) {
      if (!seen.has(line)) {
        uniqueLines.push(line);
        seen.add(line);
      }
    }
    result = uniqueLines.join('\n');

    return result;
  };

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputText(text);
    setProcessedText(processText(text));
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(processedText);
    alert('ສຳເນົາຂໍ້ຄວາມທີ່ປະມວນຜົນແລ້ວ!');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">ເຄື່ອງມືບີບອັດຂໍ້ຄວາມ / ລຶບຂໍ້ມູນຊ້ຳ</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="inputText" className="form-label">ປ້ອນຂໍ້ຄວາມຂອງທ່ານທີ່ນີ້:</label>
            <textarea
              className="form-control"
              id="inputText"
              rows="10"
              value={inputText}
              onChange={handleInputChange}
              placeholder="ປ້ອນຂໍ້ຄວາມ..."
            ></textarea>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="processedText" className="form-label">ຜົນໄດ້ຮັບ:</label>
            <textarea
              className="form-control"
              id="processedText"
              rows="10"
              value={processedText}
              readOnly
              placeholder="ຜົນໄດ້ຮັບຈະສະແດງທີ່ນີ້..."
            ></textarea>
          </div>
          <button className="btn btn-primary" onClick={handleCopyClick} disabled={!processedText}>
            ສຳເນົາຜົນໄດ້ຮັບ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextCompressor;
