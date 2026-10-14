import React from 'react';
import { Play, Zap, Keyboard, Sparkles } from 'lucide-react';

interface BottomBarProps {
  onRun: () => void;
  isLive: boolean;
  onToggleLive: (active: boolean) => void;
  onFormatAll: () => void;
  hasUnsavedChanges: boolean;
  onShowShortcuts: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  onRun,
  isLive,
  onToggleLive,
  onFormatAll,
  hasUnsavedChanges,
  onShowShortcuts
}) => {
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutLabel = isMac ? '⌘ Enter' : 'Ctrl+Enter';

  return (
    <footer className="h-14 bg-[#09090b] border-t border-neutral-800/90 px-4 flex items-center justify-between text-neutral-300 select-none shrink-0 z-30">
      {/* Left zone: Live Preview toggle & status indicator */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Live Preview Switch */}
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => onToggleLive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 transition-colors"></div>
          </div>
          <span className="text-xs sm:text-sm font-medium text-neutral-200 group-hover:text-white transition-colors flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${isLive ? 'text-emerald-400' : 'text-neutral-500'}`} />
            Live Preview
          </span>
        </label>

        {/* Live status label */}
        <div className="hidden md:flex items-center gap-2 text-xs text-neutral-500 font-mono">
          <span>·</span>
          {isLive ? (
            <span className="text-emerald-400/90">Instant render on typing</span>
          ) : hasUnsavedChanges ? (
            <span className="text-amber-400/90">Draft changes ready (Click Run)</span>
          ) : (
            <span>Preview up to date</span>
          )}
        </div>
      </div>

      {/* Right zone: Format, Shortcuts & Big Run Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onShowShortcuts}
          title="Keyboard Shortcuts"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Shortcuts</span>
        </button>

        <button
          onClick={onFormatAll}
          title="Format HTML, CSS, and JS"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Format All</span>
        </button>

        {/* Primary Run Button */}
        <button
          onClick={onRun}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 active:scale-95 transition-all shadow-lg hover:shadow-white/10 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current text-black" />
          <span>Run</span>
          <span className="hidden sm:inline-block ml-1 text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-black/10 text-neutral-800 border border-black/10">
            {shortcutLabel}
          </span>
        </button>
      </div>
    </footer>
  );
};
