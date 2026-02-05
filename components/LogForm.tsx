
import React, { useState, useEffect, useRef } from 'react';
import { LogCategory } from '../types';
import { getWritingHelp } from '../services/geminiService';

interface LogFormProps {
  onAddLog: (content: string, category: LogCategory, tags: string[], mood?: string) => void;
}

const CATEGORIES: LogCategory[] = ['Journal', 'Work', 'Personal', 'Ideas', 'Goals'];
const MOODS = ['😊', '😐', '😔', '🚀', '🧠', '✨'];

export const LogForm: React.FC<LogFormProps> = ({ onAddLog }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<LogCategory>('Journal');
  const [mood, setMood] = useState('😊');
  const [tagsInput, setTagsInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const suggestionTimeout = useRef<any>(null);

  useEffect(() => {
    if (content.length > 20) {
      if (suggestionTimeout.current) clearTimeout(suggestionTimeout.current);
      suggestionTimeout.current = setTimeout(async () => {
        const suggestion = await getWritingHelp(content);
        setAiSuggestion(suggestion);
      }, 1500);
    } else {
      setAiSuggestion('');
    }
    return () => clearTimeout(suggestionTimeout.current);
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');
    onAddLog(content, category, tags, mood);
    setContent('');
    setTagsInput('');
    setAiSuggestion('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all focus-within:shadow-md">
      <div className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Capture your thoughts..."
          className="w-full h-32 p-0 border-none focus:ring-0 text-lg text-slate-700 resize-none placeholder:text-slate-300"
        />
        
        {aiSuggestion && (
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-3 rounded-r-lg">
            <p className="text-sm text-indigo-700 italic flex items-center gap-2">
              <span className="text-lg">💡</span> {aiSuggestion}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value as LogCategory)}
            className="bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 border border-slate-200 rounded-full overflow-hidden">
            <span className="text-xs text-slate-400">Mood:</span>
            {MOODS.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`text-sm hover:scale-125 transition-transform ${mood === m ? 'opacity-100' : 'opacity-40 grayscale'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Tags (comma separated)"
            className="flex-1 min-w-[150px] bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={!content.trim()}
            className="ml-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold px-6 py-2 rounded-full transition-colors shadow-sm"
          >
            Post Log
          </button>
        </div>
      </div>
    </form>
  );
};
