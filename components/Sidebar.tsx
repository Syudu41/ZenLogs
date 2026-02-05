
import React, { useRef } from 'react';
import { LogCategory } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedCategory: LogCategory | 'All';
  onSelectCategory: (cat: LogCategory | 'All') => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CATEGORIES: (LogCategory | 'All')[] = ['All', 'Journal', 'Work', 'Personal', 'Ideas', 'Goals'];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  selectedCategory, 
  onSelectCategory,
  onExport,
  onImport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-0'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col overflow-hidden`}>
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">Z</div>
          <h1 className="font-bold text-xl tracking-tight">ZenLogs</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Category Filter</p>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              selectedCategory === cat 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Data</p>
        <button 
          onClick={onExport}
          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        >
          Export Backup (.json)
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        >
          Import Data
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".json" 
          onChange={onImport} 
          className="hidden" 
        />
        <div className="pt-6 px-4">
          <p className="text-[10px] text-slate-300 italic">v1.0.0 · Local-first storage</p>
        </div>
      </div>
    </aside>
  );
};
