
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
    setResult(null);

    try {
      const outline = await generatePPTOutline(topic);
      setResult(outline);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setStatus(GenerationStatus.ERROR);
    }
  };

  const handleCopy = useCallback(() => {
    if (!result) return;
    const text = result.slides.map(s => 
      `Slide ${s.slideNumber}: ${s.title}\n${s.bulletPoints.map(p => `- ${p}`).join('\n')}\n`
    ).join('\n---\n\n');
    
    navigator.clipboard.writeText(text);
    alert('Outline copied to clipboard!');
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="gradient-bg text-white py-12 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm border border-white/30">
            <i className="fa-solid fa-graduation-cap text-3xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            GetHelpForStudy
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Instantly generate a structured PowerPoint outline for any study topic.
          </p>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 -mt-8 pb-20">
        {/* Input Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-10 border border-slate-100">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g., Quantum Mechanics, The French Revolution, React Basics)..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-700 font-medium"
                disabled={status === GenerationStatus.LOADING}
              />
            </div>
            <button
              type="submit"
              disabled={status === GenerationStatus.LOADING || !topic.trim()}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 min-w-[160px]"
            >
              {status === GenerationStatus.LOADING ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Create Outline
                </>
              )}
            </button>
          </form>
        </section>

        {/* Loading State */}
        {status === GenerationStatus.LOADING && (
          <div className="text-center py-20">
            <div className="inline-block relative">
               <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mt-6">Crafting your presentation...</h2>
            <p className="text-slate-500 mt-2">Gemini is analyzing the topic and structuring slides for you.</p>
          </div>
        )}

        {/* Error State */}
        {status === GenerationStatus.ERROR && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
            <i className="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-4"></i>
            <h3 className="text-red-800 font-bold text-lg">Failed to generate</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button 
              onClick={() => setStatus(GenerationStatus.IDLE)}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-bold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-1">Generated Outline</p>
                <h2 className="text-3xl font-extrabold text-slate-900">{result.presentationTitle}</h2>
                <p className="text-slate-500 mt-1">Suggested for: <span className="text-slate-700 font-medium">{result.targetAudience}</span></p>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold transition-all shadow-md active:scale-95"
              >
                <i className="fa-solid fa-copy"></i>
                Copy to Clipboard
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.slides.map((slide) => (
                <SlideCard key={slide.slideNumber} slide={slide} />
              ))}
            </div>

            <footer className="mt-16 text-center border-t border-slate-200 pt-10">
              <p className="text-slate-400 text-sm">
                Generated with ❤️ for students using Google Gemini AI.
              </p>
            </footer>
          </div>
        )}

        {/* Empty State */}
        {status === GenerationStatus.IDLE && !result && (
          <div className="text-center py-20 opacity-40">
            <i className="fa-solid fa-file-powerpoint text-7xl text-slate-300 mb-6"></i>
            <h2 className="text-2xl font-bold text-slate-400">Ready to build your PPT?</h2>
            <p className="text-slate-400 mt-2">Just type your topic above to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
