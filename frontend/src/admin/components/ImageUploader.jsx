import React, { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

const ImageUploader = ({ onUpload, maxImages = 5 }) => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    // In a real app, you would upload to Cloudinary or a multipart endpoint here.
    // For now, we prepare the files to be sent via FormData later.
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    const updatedImages = [...images, ...newImages].slice(0, maxImages);
    setImages(updatedImages);
    
    // Pass the actual File objects up to the parent form
    if (onUpload) {
      onUpload(updatedImages.map(img => img.file));
    }
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    
    if (onUpload) {
      onUpload(updatedImages.map(img => img.file));
    }
  };

  return (
    <div className="image-uploader-container">
      <div 
        className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud size={40} className="upload-icon" />
        <p>Drag and drop images here, or click to browse</p>
        <span className="upload-hint">Supports JPG, PNG, WEBP (Max {maxImages} images)</span>
        
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileInput}
          className="upload-input"
        />
      </div>

      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((imageObj, index) => (
            <div key={index} className="image-preview-item">
              <img src={imageObj.preview} alt={`Preview ${index}`} />
              <button 
                type="button" 
                className="remove-image-btn"
                onClick={() => removeImage(index)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
