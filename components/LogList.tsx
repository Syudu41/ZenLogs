
import React from 'react';
import { LogEntry } from '../types';

interface LogListProps {
  logs: LogEntry[];
  onDelete: (id: string) => void;
}

export const LogList: React.FC<LogListProps> = ({ logs, onDelete }) => {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
        <p className="text-slate-400">No logs found for your selection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
          <button 
            onClick={() => onDelete(log.id)}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"
            title="Delete log"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>

          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl">{log.mood || '📝'}</span>
              <div className="w-px h-full bg-slate-100 my-2"></div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(log.category)}`}>
                  {log.category}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' · '}
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{log.content}</p>
              
              {log.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {log.tags.map(tag => (
                    <span key={tag} className="text-xs text-indigo-500 font-medium">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getCategoryColor = (cat: string) => {
  switch (cat) {
    case 'Journal': return 'bg-emerald-100 text-emerald-700';
    case 'Work': return 'bg-blue-100 text-blue-700';
    case 'Personal': return 'bg-amber-100 text-amber-700';
    case 'Ideas': return 'bg-purple-100 text-purple-700';
    case 'Goals': return 'bg-rose-100 text-rose-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};
