"use client";

import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function ImageUpload({ 
  currentImageUrl = '', 
  onImageChange, 
  uploadType = 'product', // 'restaurant-logo', 'restaurant-cover', 'category', 'product'
  className = '',
  disabled = false,
  placeholder = "Качете изображение"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  // Update preview when currentImageUrl changes (for editing existing items)
  useEffect(() => {
    setPreviewUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Невалиден формат на файла. Разрешени са само JPEG, PNG и WebP изображения.');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Файлът е твърде голям. Максималният размер е 10MB.');
      return;
    }

    // Show preview immediately
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    fileReader.readAsDataURL(file);

    // Upload to S3
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Неуспешно качване на изображението');
      }

      const result = await response.json();
      
      // Update parent component
      onImageChange(result.imageUrl);
      setPreviewUrl(result.imageUrl);
      
      toast.success('Изображението е качено успешно!');

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message);
      
      // Revert preview on error
      setPreviewUrl(currentImageUrl);
      
    } finally {
      setIsUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      console.log('ImageUpload: handleClick triggered');
      if (fileInputRef.current) {
        console.log('ImageUpload: Clicking file input');
        fileInputRef.current.click();
      } else {
        console.log('ImageUpload: File input ref is null');
      }
    } else {
      console.log('ImageUpload: Click blocked - disabled:', disabled, 'isUploading:', isUploading);
    }
  };

  return (
    <div className={`form-control ${className}`}>
      {/* Hidden file input - accessible from anywhere */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />
      
      <label className="label">
        <span className="label-text font-medium">Изображение</span>
      </label>
      
      <div className="space-y-4">
        {/* Upload Area - only show if no image */}
        {!previewUrl && (
          <div 
            onClick={handleClick}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
              ${isUploading || disabled 
                ? 'border-base-300 bg-base-100 cursor-not-allowed' 
                : 'border-base-300 hover:border-primary hover:bg-primary/5 hover:scale-105'
              }
            `}
          >
            
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="loading loading-spinner loading-lg mb-3"></div>
                <p className="text-sm font-medium text-base-content/70 mb-1">Качване...</p>
                <p className="text-xs text-base-content/50">Моля изчакайте</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 text-base-content/40 mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
                <p className="text-base font-semibold mb-1">{placeholder}</p>
                <p className="text-sm text-base-content/60 mb-2">
                  Влачете и пуснете файла тук или кликнете за избор
                </p>
                <p className="text-xs text-base-content/50">
                  JPEG, PNG, WebP • Максимум 10MB
                </p>
              </div>
            )}
          </div>
        )}

        {/* Image Preview */}
        {previewUrl && (
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-medium">Предварителен преглед</span>
              {currentImageUrl && currentImageUrl === previewUrl && (
                <span className="label-text-alt text-success">✓ Запазено</span>
              )}
            </label>
            <div className="relative group">
              <div 
                className="w-full max-w-sm bg-base-200 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={handleClick}
                title="Кликнете за промяна на изображението"
              >
                <Image
                  src={previewUrl} 
                  alt="Предварителен преглед"
                  className={`w-full h-48 object-cover transition-all duration-200 ${
                    isUploading ? 'opacity-50 blur-sm' : 'group-hover:scale-105'
                  }`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    toast.error('Грешка при зареждане на изображението');
                  }}
                />
                
                {/* Loading overlay */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-base-900/50">
                    <div className="flex flex-col items-center text-white">
                      <div className="loading loading-spinner loading-md mb-2"></div>
                      <span className="text-sm">Качване...</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Remove button */}
              {!isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  disabled={disabled}
                  className="btn btn-error btn-sm absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                  title="Премахни изображението"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              )}
              
              {/* Change image button */}
              {!isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  disabled={disabled}
                  className="btn btn-primary btn-sm absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                  title="Промени изображението"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Image info */}
            <div className="text-xs text-base-content/60">
              <div className="flex items-center justify-between">
                <span className="truncate flex-1">{previewUrl.split('/').pop()}</span>
                {currentImageUrl && currentImageUrl === previewUrl && (
                  <span className="badge badge-success badge-xs ml-2">Оригинал</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <label className="label">
        <span className="label-text-alt">
          Изображенията се оптимизират автоматично за най-добра производителност
        </span>
      </label>
    </div>
  );
}