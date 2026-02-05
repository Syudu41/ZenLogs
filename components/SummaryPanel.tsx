
import React, { useState, useEffect } from 'react';
import { LogEntry, DailySummary } from '../types';
import { summarizeLogs } from '../services/geminiService';

interface SummaryPanelProps {
  logs: LogEntry[];
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ logs }) => {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (logs.length === 0) return;
    setLoading(true);
    try {
      const result = await summarizeLogs(logs);
      setSummary(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100 sticky top-8">
      {!summary ? (
        <div className="space-y-4">
          <p className="text-indigo-100 text-sm">
            {logs.length > 0 
              ? `You have ${logs.length} entries for today. Let AI find the patterns and highlights.`
              : "Start logging today's activities to get AI-powered daily summaries."}
          </p>
          <button
            onClick={handleSummarize}
            disabled={loading || logs.length === 0}
            className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Analyzing...</span>
            ) : (
              <><span>✨</span> Generate Summary</>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center">
             <h3 className="font-bold text-lg">Today's Reflection</h3>
             <button onClick={() => setSummary(null)} className="text-indigo-200 hover:text-white text-xs">Reset</button>
          </div>
          
          <p className="text-sm leading-relaxed text-indigo-50 font-medium">
            {summary.summary}
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-300">Key Takeaways</h4>
            <ul className="space-y-1">
              {summary.keyTakeaways.map((t, i) => (
                <li key={i} className="text-xs flex gap-2">
                  <span className="text-indigo-400">•</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-indigo-500/50">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-1">Focus for Tomorrow</h4>
            <p className="text-sm italic">"{summary.suggestedFocus}"</p>
          </div>
        </div>
      )}
    </div>
  );
};
