import React, { useState } from 'react';

function WordCharacterCounter() {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const countWords = (str) => {
    const words = str.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  };

  const countCharactersWithSpaces = (str) => {
    return str.length;
  };

  const countCharactersWithoutSpaces = (str) => {
    return str.replace(/\s/g, '').length;
  };

  const countParagraphs = (str) => {
    const paragraphs = str.trim().split(/\n\s*\n/).filter(para => para.length > 0);
    return paragraphs.length;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">ເຄື່ອງນັບຈຳນວນຄຳ ແລະ ຕົວອັກສອນ</h2>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="10"
          placeholder="ປ້ອນຂໍ້ຄວາມຂອງທ່ານທີ່ນີ້..."
          value={text}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="row">
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">ຈຳນວນຄຳ</h5>
              <p className="card-text fs-3">{countWords(text)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">ຕົວອັກສອນ (ລວມຊ່ອງຫວ່າງ)</h5>
              <p className="card-text fs-3">{countCharactersWithSpaces(text)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">ຕົວອັກສອນ (ບໍ່ລວມຊ່ອງຫວ່າງ)</h5>
              <p className="card-text fs-3">{countCharactersWithoutSpaces(text)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">ຈຳນວນວັກ</h5>
              <p className="card-text fs-3">{countParagraphs(text)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordCharacterCounter;
