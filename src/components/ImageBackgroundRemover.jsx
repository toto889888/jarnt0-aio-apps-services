import React, { useState } from 'react';

function ImageBackgroundRemover() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setProcessedImage(null);
      setError(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) {
      setError("ກະລຸນາເລືອກຮູບພາບກ່ອນ.");
      return;
    }

    setLoading(true);
    setError(null);
    setProcessedImage(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      // Replace with your actual backend API endpoint
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const response = await fetch(`${backendUrl}/remove-background`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove background.');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProcessedImage(imageUrl);
    } catch (err) {
      setError(err.message);
      console.error("Error removing background:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'image_no_background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">ເຄື່ອງມືລຶບພື້ນຫຼັງຮູບພາບ</h2>
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <button
        className="btn btn-primary mb-3"
        onClick={handleRemoveBackground}
        disabled={!selectedImage || loading}
      >
        {loading ? 'ກຳລັງປະມວນຜົນ...' : 'ລຶບພື້ນຫຼັງ'}
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {processedImage && (
        <div className="mt-4 text-center d-flex flex-column align-items-center">
          <h3>ຮູບພາບທີ່ລຶບພື້ນຫຼັງແລ້ວ:</h3>
          <img
            src={processedImage}
            alt="Processed"
            className="img-fluid border rounded mb-3"
          />
          <button className="btn btn-success" onClick={handleDownload}>
            ດາວໂຫຼດ PNG
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageBackgroundRemover;
