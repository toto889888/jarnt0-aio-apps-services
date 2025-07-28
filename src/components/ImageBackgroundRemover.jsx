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

    try {

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Moved inside try block

        // Function to resize image
        const resizeImage = (file, maxWidth, maxHeight) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > maxWidth) {
                                height *= maxWidth / width;
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxHeight) {
                                width *= maxHeight / height;
                                height = maxHeight;
                            }
                        }

                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        canvas.toBlob((blob) => {
                            resolve(blob);
                        }, file.type);
                    };
                };
            });
        };

        // Resize the image before sending (e.g., max width/height 512px)
        const resizedBlob = await resizeImage(selectedImage, 512, 512);
        const resizedFile = new File([resizedBlob], selectedImage.name, { type: selectedImage.type });

        const formData = new FormData();
        formData.append('image', resizedFile); // Use the resized file

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
