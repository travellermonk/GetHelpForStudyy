
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
      setError(err.message || 'Failed to connect to Gemini. Make sure your API key is configured correctly in your environment.');
      setStatus(GenerationStatus.ERROR);
    }
  };

  const handleCopy = useCallback(() => {
    if (!result) return;
    const text = `TITLE: ${result.presentationTitle}\n\n` + 
      result.slides.map(s => 
        `SLIDE ${s.slideNumber}: ${s.title}\n${s.bulletPoints.map(p => `• ${p}`).join('\n')}\n[Visual]: ${s.visualSuggestion}\n`
      ).join('\n---\n\n');
    
    navigator.clipboard.writeText(text);
    alert('Full outline copied to clipboard!');
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Navbar Style Header */}
      <header className="gradient-bg text-white pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md border border-white/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <i className="fa-solid fa-sparkles text-amber-300"></i>
            <span className="text-sm font-semibold tracking-wide uppercase">AI-Powered Study Assistant</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            GetHelpForStudy
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Turn your research topics into professional PowerPoint structures. 
            Perfect for students, teachers, and researchers.
          </p>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 -mt-12 relative z-20">
        {/* Search Bar */}
        <section className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 p-4 md:p-6 mb-12 border border-slate-100">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What are you studying? (e.g., The Industrial Revolution, Neural Networks...)"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 text-lg font-medium placeholder:text-slate-400"
                disabled={status === GenerationStatus.LOADING}
              />
            </div>
            <button
              type="submit"
              disabled={status === GenerationStatus.LOADING || !topic.trim()}
              className="px-10 py-5 gradient-btn text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:grayscale"
            >
              {status === GenerationStatus.LOADING ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Researching...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Build PPT
                </>
              )}
            </button>
          </form>
        </section>

        {/* Loading / Error States */}
        {status === GenerationStatus.LOADING && (
          <div className="text-center py-20 animate-pulse">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <i className="fa-solid fa-brain text-indigo-600 text-3xl animate-bounce"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Gemini is brainstorming...</h2>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Structuring content, drafting bullet points, and finding visual inspirations.</p>
          </div>
        )}

        {status === GenerationStatus.ERROR && (
          <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-10 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            </div>
            <h3 className="text-red-900 font-bold text-xl mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-8">{error}</p>
            <button 
              onClick={() => setStatus(GenerationStatus.IDLE)}
              className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success Results */}
        {result && status === GenerationStatus.SUCCESS && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-widest">
                    Study Topic: {result.topic}
                  </span>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                  {result.presentationTitle}
                </h2>
                <p className="text-slate-500 mt-2">
                  Target Audience: <span className="font-semibold text-slate-700">{result.targetAudience}</span>
                </p>
              </div>
              <button 
                onClick={handleCopy}
                className="group flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all hover:bg-slate-800 hover:-translate-y-1 active:scale-95 shadow-xl shadow-slate-200"
              >
                <i className="fa-solid fa-copy group-hover:text-indigo-400 transition-colors"></i>
                Copy Full Outline
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {result.slides.map((slide) => (
                <SlideCard key={slide.slideNumber} slide={slide} />
              ))}
            </div>

            <div className="mt-16 bg-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl shadow-indigo-200">
              <i className="fa-solid fa-graduation-cap text-5xl mb-6 opacity-50"></i>
              <h3 className="text-2xl font-bold mb-4">Ready for your presentation?</h3>
              <p className="text-indigo-100 max-w-xl mx-auto mb-8">
                This outline provides the skeletal structure. Now, open PowerPoint or Google Slides and bring these concepts to life!
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all"
              >
                Start New Research
              </button>
            </div>
          </div>
        )}

        {/* Placeholder / Empty State */}
        {status === GenerationStatus.IDLE && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 opacity-60">
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
              <i className="fa-solid fa-lightbulb text-slate-300 text-4xl mb-4"></i>
              <h4 className="font-bold text-slate-400">Step 1: Topic</h4>
              <p className="text-sm text-slate-400 mt-2">Enter any concept from your syllabus or research paper.</p>
            </div>
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
              <i className="fa-solid fa-microchip text-slate-300 text-4xl mb-4"></i>
              <h4 className="font-bold text-slate-400">Step 2: AI Magic</h4>
              <p className="text-sm text-slate-400 mt-2">Gemini analyzes and structures it into academic slides.</p>
            </div>
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
              <i className="fa-solid fa-file-powerpoint text-slate-300 text-4xl mb-4"></i>
              <h4 className="font-bold text-slate-400">Step 3: Export</h4>
              <p className="text-sm text-slate-400 mt-2">Copy the outline and paste it into your slides editor.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-slate-400 text-sm">
        Powered By Gemini & Techno Tank with Dev Monk
      </footer>
    </div>
  );
};

export default App;
