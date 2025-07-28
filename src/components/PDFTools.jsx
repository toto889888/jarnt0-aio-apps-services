import React, { useState } from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';

const PDFTools = () => {
  const [mergeFiles, setMergeFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  const [splitPageNumbers, setSplitPageNumbers] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (setter) => (event) => {
    setter(Array.from(event.target.files));
    setMessage('');
  };

  const mergePdfs = async () => {
    if (mergeFiles.length < 2) {
      setMessage('ກະລຸນາເລືອກໄຟລ໌ PDF ຢ່າງໜ້ອຍ 2 ໄຟລ໌ເພື່ອລວມ');
      return;
    }
    setLoading(true);
    setMessage('ກຳລັງລວມໄຟລ໌ PDF...');
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of mergeFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const donorPdfDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await pdfDoc.copyPages(donorPdfDoc, donorPdfDoc.getPageIndices());
        copiedPages.forEach((page) => pdfDoc.addPage(page));
      }
      const pdfBytes = await pdfDoc.save();
      downloadPdf(pdfBytes, 'merged.pdf');
      setMessage('ລວມໄຟລ໌ PDF ສຳເລັດ!');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      setMessage('ເກີດຂໍ້ຜິດພາດໃນການລວມໄຟລ໌ PDF');
    } finally {
      setLoading(false);
    }
  };

  const splitPdf = async () => {
    if (!splitFile) {
      setMessage('ກະລຸນາເລືອກໄຟລ໌ PDF ເພື່ອແຍກ');
      return;
    }
    if (!splitPageNumbers.trim()) {
      setMessage('ກະລຸນາລະບຸໝາຍເລກໜ້າທີ່ຕ້ອງການແຍກ (ເຊັ່ນ 1,3-5)');
      return;
    }
    setLoading(true);
    setMessage('ກຳລັງແຍກໄຟລ໌ PDF...');
    try {
      const arrayBuffer = await splitFile.arrayBuffer();
      const originalPdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = originalPdfDoc.getPageCount();

      const pagesToExtract = parsePageNumbers(splitPageNumbers, totalPages);

      if (pagesToExtract.length === 0) {
        setMessage('ບໍ່ພົບໜ້າທີ່ຖືກຕ້ອງຕາມທີ່ລະບຸ');
        setLoading(false);
        return;
      }

      const newPdfDoc = await PDFDocument.create();
      const copiedPages = await newPdfDoc.copyPages(originalPdfDoc, pagesToExtract);
      copiedPages.forEach((page) => newPdfDoc.addPage(page));

      const pdfBytes = await newPdfDoc.save();
      downloadPdf(pdfBytes, 'split.pdf');
      setMessage('ແຍກໄຟລ໌ PDF ສຳເລັດ!');
    } catch (error) {
      console.error('Error splitting PDF:', error);
      setMessage('ເກີດຂໍ້ຜິດພາດໃນການແຍກໄຟລ໌ PDF');
    } finally {
      setLoading(false);
    }
  };

  const parsePageNumbers = (input, totalPages) => {
    const pages = new Set();
    const parts = input.split(',').map(p => p.trim());
    parts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= totalPages) {
          for (let i = start; i <= end; i++) {
            pages.add(i - 1); // PDF-lib is 0-indexed
          }
        }
      } else {
        const pageNum = Number(part);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
          pages.add(pageNum - 1); // PDF-lib is 0-indexed
        }
      }
    });
    return Array.from(pages).sort((a, b) => a - b);
  };

  const imagesToPdf = async () => {
    if (imageFiles.length === 0) {
      setMessage('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບຢ່າງໜ້ອຍ 1 ໄຟລ໌');
      return;
    }
    setLoading(true);
    setMessage('ກຳລັງແປງຮູບພາບເປັນ PDF...');
    try {
      const pdfDoc = await PDFDocument.create();
      

      for (const file of imageFiles) {
        let image;
        const arrayBuffer = await file.arrayBuffer();
        const mimeType = file.type;

        if (mimeType.startsWith('image/jpeg')) {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (mimeType.startsWith('image/png')) {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          setMessage(`ບໍ່ຮອງຮັບໄຟລ໌ປະເພດ: ${mimeType}`);
          continue;
        }

        const page = pdfDoc.addPage();
        image.scale(1); // Get original dimensions
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        });
      }

      const pdfBytes = await pdfDoc.save();
      downloadPdf(pdfBytes, 'images.pdf');
      setMessage('ແປງຮູບພາບເປັນ PDF ສຳເລັດ!');
    } catch (error) {
      console.error('Error converting images to PDF:', error);
      setMessage('ເກີດຂໍ້ຜິດພາດໃນການແປງຮູບພາບເປັນ PDF');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = (bytes, filename) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">ເຄື່ອງມືສຳລັບຈັດການໄຟລ໌ PDF ເບື້ອງຕົ້ນ</h2>

      {loading && (
        <div className="alert alert-info">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">ກຳລັງໂຫຼດ...</span>
          </div>
          {message}
        </div>
      )}
      {message && !loading && (
        <div className={`alert ${message.includes('สำเร็จ') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      {/* Merge PDFs */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">ລວມໄຟລ໌ PDF</div>
        <div className="card-body">
          <p>ອັບໂຫຼດໄຟລ໌ PDF ຫຼາຍໄຟລ໌ເພື່ອລວມເປັນໄຟລ໌ດຽວ</p>
          <input
            type="file"
            className="form-control mb-3"
            accept=".pdf"
            multiple
            onChange={handleFileChange(setMergeFiles)}
          />
          <button className="btn btn-primary" onClick={mergePdfs} disabled={loading || mergeFiles.length < 2}>
            ລວມໄຟລ໌ PDF
          </button>
          {mergeFiles.length > 0 && (
            <div className="mt-2">
              <small className="text-muted">ເລືອກແລ້ວ {mergeFiles.length} ໄຟລ໌</small>
            </div>
          )}
        </div>
      </div>

      {/* Split PDF */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">ແຍກໄຟລ໌ PDF</div>
        <div className="card-body">
          <p>ອັບໂຫຼດໄຟລ໌ PDF ແລະລະບຸໝາຍເລກໜ້າທີ່ຕ້ອງການແຍກ</p>
          <input
            type="file"
            className="form-control mb-3"
            accept=".pdf"
            onChange={(e) => { setSplitFile(e.target.files[0]); setMessage(''); }}
          />
          <div className="mb-3">
            <label htmlFor="splitPageNumbers" className="form-label">ໝາຍເລກໜ້າທີ່ຕ້ອງການແຍກ (ເຊັ່ນ 1,3-5):</label>
            <input
              type="text"
              className="form-control"
              id="splitPageNumbers"
              value={splitPageNumbers}
              onChange={(e) => setSplitPageNumbers(e.target.value)}
              placeholder="ເຊັ່ນ 1, 3-5, 7"
            />
          </div>
          <button className="btn btn-primary" onClick={splitPdf} disabled={loading || !splitFile || !splitPageNumbers.trim()}>
            ແຍກໄຟລ໌ PDF
          </button>
          {splitFile && (
            <div className="mt-2">
              <small className="text-muted">ໄຟລ໌ທີ່ເລືອກ: {splitFile.name}</small>
            </div>
          )}
        </div>
      </div>

      {/* Convert Images to PDF */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">ແປງຮູບພາບເປັນ PDF</div>
        <div className="card-body">
          <p>ອັບໂຫຼດຮູບພາບ (JPG, PNG) ເພື່ອແປງເປັນໄຟລ໌ PDF</p>
          <input
            type="file"
            className="form-control mb-3"
            accept="image/jpeg, image/png"
            multiple
            onChange={handleFileChange(setImageFiles)}
          />
          <button className="btn btn-primary" onClick={imagesToPdf} disabled={loading || imageFiles.length === 0}>
            ແປງຮູບພາບເປັນ PDF
          </button>
          {imageFiles.length > 0 && (
            <div className="mt-2">
              <small className="text-muted">ເລືອກແລ້ວ {imageFiles.length} ໄຟລ໌</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFTools;
