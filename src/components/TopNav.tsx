import React, { useState } from 'react';
import { 
  Code2, 
  Columns, 
  Rows, 
  FolderDown, 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { LayoutMode, PresetTemplate } from '../types';
import { PRESET_TEMPLATES } from '../templates';

interface TopNavProps {
  layout: LayoutMode;
  onLayoutChange: (layout: LayoutMode) => void;
  onSelectPreset: (preset: PresetTemplate) => void;
  onExportClick: () => void;
  onResetClick: () => void;
  currentPresetId: string | null;
}

export const TopNav: React.FC<TopNavProps> = ({
  layout,
  onLayoutChange,
  onSelectPreset,
  onExportClick,
  onResetClick,
  currentPresetId
}) => {
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  return (
    <header className="h-13 bg-[#000000] border-b border-neutral-800/80 px-4 flex items-center justify-between text-neutral-300 select-none z-30 shrink-0">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shadow-inner">
          <Code2 className="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight text-white">AetherCode</span>
          <span className="text-neutral-500 text-xs ml-2 hidden sm:inline font-mono">Live Studio</span>
        </div>
      </div>

      {/* Zone 2: Navigation & Mode Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Presets dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPresetsOpen(!isPresetsOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Templates</span>
            <span className="sm:hidden">Templates</span>
          </button>

          {isPresetsOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsPresetsOpen(false)} 
              />
              <div className="absolute left-0 mt-2 w-72 bg-[#0d0d10] border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
                <div className="text-[10px] font-semibold text-neutral-500 uppercase px-2 py-1 tracking-wider">
                  Select Starter Template
                </div>
                <div className="space-y-1 mt-1">
                  {PRESET_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        onSelectPreset(tpl);
                        setIsPresetsOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex flex-col gap-0.5 ${
                        currentPresetId === tpl.id 
                          ? 'bg-neutral-800/80 text-white border border-neutral-700/50' 
                          : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{tpl.name}</span>
                        <span className="text-[10px] text-neutral-500">{tpl.category}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 line-clamp-1">
                        {tpl.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Layout Switcher segmented control */}
        <div className="hidden md:flex items-center bg-neutral-900/90 border border-neutral-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => onLayoutChange('horizontal')}
            title="Split Horizontal (Side-by-Side)"
            className={`p-1.5 rounded-md transition-colors ${
              layout === 'horizontal' ? 'bg-neutral-800 text-white font-medium shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onLayoutChange('vertical')}
            title="Split Vertical (Stacked)"
            className={`p-1.5 rounded-md transition-colors ${
              layout === 'vertical' ? 'bg-neutral-800 text-white font-medium shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Rows className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onLayoutChange('tabs')}
            title="Tabbed Editor View"
            className={`p-1.5 rounded-md transition-colors ${
              layout === 'tabs' ? 'bg-neutral-800 text-white font-medium shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onLayoutChange('three-col')}
            title="3 Columns (HTML | CSS | JS)"
            className={`p-1.5 rounded-md transition-colors ${
              layout === 'three-col' ? 'bg-neutral-800 text-white font-medium shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={onResetClick}
          title="Reset Code"
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Zone 3: Primary Action - Export */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExportClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 text-xs font-semibold transition-all cursor-pointer"
        >
          <FolderDown className="w-3.5 h-3.5 text-neutral-300" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
