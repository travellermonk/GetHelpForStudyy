
import React, { useState, useCallback } from 'react';
import { generatePPTOutline } from './services/geminiService';
import { PPTOutline, GenerationStatus } from './types';
import { SlideCard } from './components/SlideCard';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [result, setResult] = useState<PPTOutline | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setStatus(GenerationStatus.LOADING);
    setError(null);

    try {
      const outline = await generatePPTOutline(topic);
      setResult(outline);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while connecting to the server.');
      setStatus(GenerationStatus.ERROR);
    }
  };

  const handleCopy = useCallback(() => {
    if (!result) return;
    const text = `PRESENTATION: ${result.presentationTitle}\n` +
      `AUDIENCE: ${result.targetAudience}\n\n` + 
      result.slides.map(s => 
        `SLIDE ${s.slideNumber}: ${s.title}\n${s.bulletPoints.map(p => `• ${p}`).join('\n')}\n[Visual]: ${s.visualSuggestion}\n`
      ).join('\n---\n\n');
    
    navigator.clipboard.writeText(text);
    alert('Presentation content copied to clipboard!');
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="gradient-bg text-white pt-20 pb-28 px-6 relative">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-6 backdrop-blur-sm">
            <i className="fa-solid fa-graduation-cap text-indigo-200"></i>
            <span className="text-xs font-bold uppercase tracking-widest">Full-Stack Study Assistant</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">GetHelpForStudy</h1>
          <p className="text-indigo-100 text-lg opacity-90 max-w-2xl mx-auto">
            High-quality PowerPoint outlines generated instantly via Vercel Backend & Gemini AI.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 p-6 mb-12 border border-slate-100">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <i className="fa-solid fa-book-sparkles absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What are you researching today?"
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 font-medium"
                disabled={status === GenerationStatus.LOADING}
              />
            </div>
            <button
              type="submit"
              disabled={status === GenerationStatus.LOADING || !topic.trim()}
              className="px-8 py-4 gradient-btn text-white rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all"
            >
              {status === GenerationStatus.LOADING ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Build Outline
                </>
              )}
            </button>
          </form>
        </div>

        {status === GenerationStatus.LOADING && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <i className="fa-solid fa-server text-indigo-600 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Contacting Vercel Backend</h3>
            <p className="text-slate-500 mt-2">Processing your request through Gemini AI...</p>
          </div>
        )}

        {status === GenerationStatus.ERROR && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
            <i className="fa-solid fa-triangle-exclamation text-red-500 text-4xl mb-4"></i>
            <h4 className="text-red-900 font-bold text-lg">Backend Error</h4>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={() => setStatus(GenerationStatus.IDLE)}
              className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-bold"
            >
              Try Again
            </button>
          </div>
        )}

        {result && status === GenerationStatus.SUCCESS && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-slate-200 pb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
                  {result.presentationTitle}
                </h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                    Topic: {result.topic}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <i className="fa-solid fa-copy"></i>
                Copy All Content
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.slides.map((slide) => (
                <SlideCard key={slide.slideNumber} slide={slide} />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 py-10 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p className="font-medium tracking-wide">Powered By Gemini & Techno Tank with Dev Monk</p>
      </footer>
    </div>
  );
};

export default App;
