// ImageUploadPreview.jsx
import React, { useState, useEffect } from "react";

const ImageUploadPreview = ({ 
  existingImages = [], 
  newImages = [], 
  onExistingChange, 
  onNewChange 
}) => {
  // Convert existing image paths to full URLs for preview.
  const fullExistingUrls = existingImages.map(
    (img) => `${import.meta.env.VITE_SERVER_URL}/${img}`
  );

  // For new images, create preview URLs from File objects.
  const [newPreviews, setNewPreviews] = useState([]);
  useEffect(() => {
    const previews = newImages.map(file => URL.createObjectURL(file));
    setNewPreviews(previews);

    // Cleanup the object URLs when newImages change
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Append new files to existing newImages
    onNewChange([...newImages, ...files]);
  };

  const handleDeleteExisting = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    onExistingChange(updated);
  };

  const handleDeleteNew = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    onNewChange(updated);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        {/* Existing images */}
        {fullExistingUrls.map((src, index) => (
          <div
            key={`existing-${index}`}
            style={{ position: "relative", marginRight: "8px", marginBottom: "8px" }}
          >
            <img
              src={src}
              alt={`Existing Preview ${index}`}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <button
              onClick={() => handleDeleteExisting(index)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        ))}
        {/* New image previews */}
        {newPreviews.map((src, index) => (
          <div
            key={`new-${index}`}
            style={{ position: "relative", marginRight: "8px", marginBottom: "8px" }}
          >
            <img
              src={src}
              alt={`New Preview ${index}`}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <button
              onClick={() => handleDeleteNew(index)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadPreview;
