import React, { useRef, useState } from 'react';
import { ImageState } from '../types';

interface ImageUploaderProps {
  onImageSelected: (image: ImageState) => void;
  selectedImage: ImageState | null;
  onClear: () => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelected, 
  selectedImage, 
  onClear,
  disabled 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageSelected({
        data: base64String,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/50 shadow-2xl transition-all duration-300">
        <img 
          src={selectedImage.data} 
          alt="Original" 
          className="w-full h-auto max-h-[60vh] object-contain mx-auto"
        />
        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <button 
            onClick={onClear}
            disabled={disabled}
            className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-full font-medium transition-colors"
          >
            Remove Image
          </button>
        </div>
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/10">
          Original
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full aspect-video md:aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 cursor-pointer group
        ${isDragging 
          ? 'border-brand-500 bg-brand-500/10' 
          : 'border-slate-700 hover:border-slate-600 bg-slate-800/30 hover:bg-slate-800/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden"
        disabled={disabled}
      />
      
      <div className="w-16 h-16 mb-4 rounded-full bg-slate-700/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400 group-hover:text-brand-400 transition-colors">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-200 mb-2">Upload an image</h3>
      <p className="text-slate-400 text-sm text-center max-w-xs">
        Drag and drop your image here, or click to browse files
      </p>
      <p className="mt-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">
        JPG, PNG, WEBP
      </p>
    </div>
  );
};
