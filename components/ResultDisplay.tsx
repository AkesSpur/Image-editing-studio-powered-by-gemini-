import React, { useState, useEffect } from 'react';
import { AppStatus, GeneratedContent } from '../types';

interface ResultDisplayProps {
  status: AppStatus;
  result: GeneratedContent | null;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ status, result, error }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    if (isFullScreen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isFullScreen]);
  
  const handleDownload = () => {
    if (!result?.imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // Convert to WebP with 0.9 quality
        const webpDataUrl = canvas.toDataURL('image/webp', 0.9);
        
        const link = document.createElement('a');
        link.href = webpDataUrl;
        link.download = 'gemini-edit.webp';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    img.src = result.imageUrl;
  };

  if (status === AppStatus.IDLE) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-slate-800 bg-slate-900/50 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-400">Ready to Create</h3>
        <p className="text-slate-500 text-sm mt-2 max-w-sm">
          Upload an image and enter a prompt to see the magic happen here.
        </p>
      </div>
    );
  }

  if (status === AppStatus.PROCESSING) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-slate-800 bg-slate-900/50 rounded-2xl p-8">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-4 rounded-full bg-slate-800 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-400 animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-medium text-white animate-pulse">Generating...</h3>
        <p className="text-slate-400 text-sm mt-2">Gemini is reimagining your image</p>
      </div>
    );
  }

  if (status === AppStatus.ERROR) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-red-900/30 bg-red-900/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4 border border-red-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008h-.008v-.008z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-200">Something went wrong</h3>
        <p className="text-red-300/70 text-sm mt-2 max-w-sm mb-6">
          {error || "We couldn't generate your image. Please try a different prompt or image."}
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <>
        <div className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/50 shadow-2xl transition-all duration-300">
          {result.imageUrl ? (
            <img 
              src={result.imageUrl} 
              alt="Generated Result" 
              className="w-full h-auto max-h-[60vh] object-contain mx-auto cursor-zoom-in"
              onClick={() => setIsFullScreen(true)}
            />
          ) : (
            <div className="p-8 text-slate-300 text-center">
              <p>{result.text}</p>
            </div>
          )}
          
          {/* Removed Generated by Gemini tag */}
          
          {result.imageUrl && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button 
                onClick={() => setIsFullScreen(true)}
                className="px-4 py-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-sm font-medium border border-slate-700 backdrop-blur-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                Full Screen
              </button>
              <button 
                onClick={handleDownload}
                className="px-4 py-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-sm font-medium border border-slate-700 backdrop-blur-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download WebP
              </button>
            </div>
          )}
        </div>

        {/* Full Screen Modal */}
        {isFullScreen && result.imageUrl && (
          <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
            <button 
              onClick={() => setIsFullScreen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img 
              src={result.imageUrl} 
              alt="Generated Result Full Screen" 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            />
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
               <button 
                onClick={handleDownload}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium shadow-lg shadow-brand-900/40 flex items-center gap-2 transition-all hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download WebP
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};