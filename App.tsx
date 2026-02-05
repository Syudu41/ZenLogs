
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LogEntry, LogCategory } from './types';
import { LogForm } from './components/LogForm';
import { LogList } from './components/LogList';
import { SummaryPanel } from './components/SummaryPanel';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load logs on mount
  useEffect(() => {
    const saved = localStorage.getItem('zen_logs');
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
  }, []);

  // Save logs on change
  useEffect(() => {
    localStorage.setItem('zen_logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = useCallback((content: string, category: LogCategory, tags: string[], mood?: string) => {
    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      content,
      category,
      tags,
      mood
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const deleteLog = useCallback((id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
      const matchesSearch = log.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [logs, selectedCategory, searchQuery]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenlogs-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedLogs = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedLogs)) {
          setLogs(prev => [...importedLogs, ...prev].sort((a, b) => b.timestamp - a.timestamp));
        }
      } catch (err) {
        alert("Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onExport={handleExport}
        onImport={handleImport}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-12">
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">What's on your mind?</h2>
              <LogForm onAddLog={addLog} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Your Logs</h2>
                    <span className="text-xs text-slate-400">{filteredLogs.length} entries found</span>
                 </div>
                 <LogList logs={filteredLogs} onDelete={deleteLog} />
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800">Daily Insights</h2>
                <SummaryPanel logs={logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString())} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
