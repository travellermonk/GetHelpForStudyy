
import React from 'react';
import { Slide } from '../types';

interface SlideCardProps {
  slide: Slide;
}

export const SlideCard: React.FC<SlideCardProps> = ({ slide }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
            {slide.slideNumber}
          </span>
          {slide.title}
        </h3>
      </div>
      <div className="p-5">
        <ul className="space-y-3 mb-6">
          {slide.bulletPoints.map((point, idx) => (
            <li key={idx} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
              <span className="text-indigo-400 mt-1">•</span>
              {point}
            </li>
          ))}
        </ul>
        <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-3 border border-amber-100">
          <i className="fa-solid fa-wand-magic-sparkles text-amber-500 mt-1"></i>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-amber-600 mb-1">Visual Suggestion</p>
            <p className="text-xs text-amber-800 italic">{slide.visualSuggestion}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
