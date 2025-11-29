import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Controls } from './components/Controls';
import { ResultDisplay } from './components/ResultDisplay';
import { editImageWithGemini } from './services/geminiService';
import { AppStatus, ImageState, GeneratedContent } from './types';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageState | null>(null);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (image: ImageState) => {
    setSelectedImage(image);
    // Reset state when new image is selected
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
    setPrompt('');
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) return;

    setStatus(AppStatus.PROCESSING);
    setError(null);
    setResult(null);

    try {
      const generatedContent = await editImageWithGemini(
        selectedImage.data,
        selectedImage.mimeType,
        prompt
      );
      setResult(generatedContent);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error("Generation failed", err);
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs border border-slate-700">1</span>
                  Source Image
                </h2>
              </div>
              <ImageUploader 
                onImageSelected={handleImageSelected} 
                selectedImage={selectedImage}
                onClear={handleClearImage}
                disabled={status === AppStatus.PROCESSING}
              />
            </section>

            <section className={!selectedImage ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
               <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs border border-slate-700">2</span>
                  Edit Instructions
                </h2>
              </div>
              <Controls 
                prompt={prompt} 
                setPrompt={setPrompt} 
                onGenerate={handleGenerate} 
                status={status}
                disabled={!selectedImage}
              />
            </section>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs border border-slate-700">3</span>
                Result
              </h2>
              {status === AppStatus.SUCCESS && (
                <button 
                  onClick={() => {
                    setResult(null);
                    setStatus(AppStatus.IDLE);
                  }}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Clear Result
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-slate-900/30 rounded-3xl border border-slate-800/50 p-2 shadow-inner">
               <ResultDisplay status={status} result={result} error={error} />
            </div>
            
            {status === AppStatus.SUCCESS && (
              <div className="mt-4 p-4 bg-brand-900/20 border border-brand-500/20 rounded-xl flex items-start gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-400 mt-0.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008h-.008V8.25z" />
                </svg>
                <p className="text-sm text-brand-200">
                  Tip: Be specific with your prompts. You can ask to change styles, add objects, remove backgrounds, or alter lighting.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
      
      <footer className="w-full py-6 border-t border-slate-900 mt-auto bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Gemini Image Studio. Built with Google Gemini API.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
