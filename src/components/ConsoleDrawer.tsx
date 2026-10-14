import React, { useState } from 'react';
import { Terminal, Trash2, ChevronUp, ChevronDown, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { ConsoleEntry } from '../types';

interface ConsoleDrawerProps {
  logs: ConsoleEntry[];
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ConsoleDrawer: React.FC<ConsoleDrawerProps> = ({
  logs,
  onClear,
  isOpen,
  onToggle
}) => {
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'log'>('all');

  const errorCount = logs.filter(l => l.type === 'error').length;
  const warnCount = logs.filter(l => l.type === 'warn').length;

  const filteredLogs = logs.filter(l => {
    if (filter === 'all') return true;
    if (filter === 'error') return l.type === 'error';
    if (filter === 'warn') return l.type === 'warn';
    if (filter === 'log') return l.type === 'log' || l.type === 'info';
    return true;
  });

  return (
    <div className="border-t border-neutral-800 bg-[#09090b] flex flex-col transition-all duration-200">
      {/* Console Bar Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d0d10] select-none text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 font-semibold text-neutral-200 hover:text-white transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-neutral-400" />
            <span>Console</span>
            {isOpen ? <ChevronDown className="w-3 h-3 text-neutral-400" /> : <ChevronUp className="w-3 h-3 text-neutral-400" />}
          </button>

          {/* Counts */}
          {errorCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-800/40 font-mono">
              <AlertCircle className="w-3 h-3" />
              {errorCount}
            </span>
          )}

          {warnCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40 font-mono">
              <AlertTriangle className="w-3 h-3" />
              {warnCount}
            </span>
          )}

          {isOpen && (
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${filter === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'}`}
              >
                All ({logs.length})
              </button>
              <button
                onClick={() => setFilter('error')}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${filter === 'error' ? 'bg-neutral-800 text-red-400 font-medium' : 'text-neutral-400 hover:text-white'}`}
              >
                Errors ({errorCount})
              </button>
              <button
                onClick={() => setFilter('warn')}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${filter === 'warn' ? 'bg-neutral-800 text-amber-400 font-medium' : 'text-neutral-400 hover:text-white'}`}
              >
                Warnings ({warnCount})
              </button>
              <button
                onClick={() => setFilter('log')}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${filter === 'log' ? 'bg-neutral-800 text-neutral-200 font-medium' : 'text-neutral-400 hover:text-white'}`}
              >
                Logs
              </button>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              title="Clear Console"
              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors flex items-center gap-1 text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Logs Viewport */}
      {isOpen && (
        <div className="h-36 overflow-y-auto bg-[#000000] p-2 font-code text-xs space-y-1 divide-y divide-neutral-900">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-neutral-600 text-xs italic">
              Console output is empty. Run JavaScript statements or console.log() to view messages.
            </div>
          ) : (
            filteredLogs.map((entry) => {
              const isError = entry.type === 'error';
              const isWarn = entry.type === 'warn';
              return (
                <div
                  key={entry.id}
                  className={`py-1 px-2 flex items-start gap-2.5 rounded font-mono text-[11px] leading-relaxed ${
                    isError
                      ? 'bg-red-950/20 text-red-300 border-l-2 border-red-500'
                      : isWarn
                      ? 'bg-amber-950/20 text-amber-300 border-l-2 border-amber-500'
                      : 'text-neutral-300'
                  }`}
                >
                  <span className="text-neutral-600 shrink-0 text-[10px] select-none pt-0.5">
                    {entry.timestamp}
                  </span>
                  {isError ? (
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  ) : isWarn ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  )}
                  <pre className="flex-1 whitespace-pre-wrap break-words">{entry.content}</pre>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
