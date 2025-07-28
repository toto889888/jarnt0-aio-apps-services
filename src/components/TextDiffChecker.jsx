import React, { useState, useEffect } from 'react';
import { diff_match_patch } from 'diff-match-patch';

const dmp = new diff_match_patch();

const TextDiffChecker = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [diffResult, setDiffResult] = useState([]);

  useEffect(() => {
    if (oldText || newText) {
      const diff = dmp.diff_main(oldText, newText);
      dmp.diff_cleanupSemantic(diff); // Optional: clean up diff for better readability
      setDiffResult(diff);
    } else {
      setDiffResult([]);
    }
  }, [oldText, newText]);

  const renderDiff = () => {
    return diffResult.map((part, index) => {
      // part[0] is the type of change: -1 for deletion, 0 for equality, 1 for insertion
      // part[1] is the text
      const text = part[1];
      const type = part[0];

      if (type === 0) {
        return <span key={index}>{text}</span>;
      } else if (type === -1) {
        return <del key={index} className="bg-danger text-white">{text}</del>;
      } else if (type === 1) {
        return <ins key={index} className="bg-success text-white">{text}</ins>;
      }
      return null;
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">ໂປຣແກຣມປຽບທຽບຂໍ້ຄວາມ</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="oldText" className="form-label">ຂໍ້ຄວາມເກົ່າ:</label>
            <textarea
              className="form-control"
              id="oldText"
              rows="10"
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="ປ້ອນຂໍ້ຄວາມເກົ່າທີ່ນີ້..."
            ></textarea>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="newText" className="form-label">ຂໍ້ຄວາມໃໝ່:</label>
            <textarea
              className="form-control"
              id="newText"
              rows="10"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="ປ້ອນຂໍ້ຄວາມໃໝ່ທີ່ນີ້..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3>ຜົນໄດ້ຮັບການປຽບທຽບ:</h3>
        <div className="card p-3" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {diffResult.length > 0 ? renderDiff() : <p className="text-muted">ປ້ອນຂໍ້ຄວາມເພື່ອເບິ່ງຄວາມແຕກຕ່າງ</p>}
        </div>
      </div>
    </div>
  );
};

export default TextDiffChecker;
