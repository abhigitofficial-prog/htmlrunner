import React, { useRef, useState, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
import { DeviceMode, ConsoleEntry } from '../types';
import { ConsoleDrawer } from './ConsoleDrawer';

interface PreviewProps {
  compiledCode: string;
  isLive: boolean;
  onRefresh: () => void;
  lastRunTimestamp: string | null;
  consoleLogs: ConsoleEntry[];
  onClearLogs: () => void;
}

export const Preview: React.FC<PreviewProps> = ({
  compiledCode,
  isLive,
  onRefresh,
  lastRunTimestamp,
  consoleLogs,
  onClearLogs
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('full');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Auto open console if an error is received and console is closed
  useEffect(() => {
    const hasError = consoleLogs.some(l => l.type === 'error');
    if (hasError && !isConsoleOpen && consoleLogs.length > 0) {
      // Auto open if error detected
      setIsConsoleOpen(true);
    }
  }, [consoleLogs]);

  // Set srcdoc directly when compiled code changes
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = compiledCode;
    }
  }, [compiledCode]);

  const getDeviceWidthClass = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'w-[375px] max-w-full';
      case 'tablet':
        return 'w-[768px] max-w-full';
      case 'desktop':
        return 'w-[1100px] max-w-full';
      case 'full':
      default:
        return 'w-full';
    }
  };

  const handleOpenNewWindow = () => {
    const blob = new Blob([compiledCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className={`flex flex-col h-full bg-[#050507] text-neutral-200 border border-neutral-800/80 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      {/* Top Preview Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0d0d10] border-b border-neutral-800/90 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-neutral-200">Live Preview</span>
          </div>
          
          <span className="text-[11px] text-neutral-500 font-mono hidden md:inline">
            {lastRunTimestamp ? `Last rendered ${lastRunTimestamp}` : 'Awaiting execution'}
          </span>
        </div>

        {/* Device Mode Switchers & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 text-neutral-400">
          <div className="hidden sm:flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5 text-xs">
            <button
              onClick={() => setDeviceMode('full')}
              title="Responsive 100%"
              className={`p-1 rounded ${deviceMode === 'full' ? 'bg-neutral-800 text-white font-medium' : 'hover:text-white'}`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              title="Desktop (1100px)"
              className={`p-1 rounded ${deviceMode === 'desktop' ? 'bg-neutral-800 text-white font-medium' : 'hover:text-white'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              title="Tablet (768px)"
              className={`p-1 rounded ${deviceMode === 'tablet' ? 'bg-neutral-800 text-white font-medium' : 'hover:text-white'}`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              title="Mobile (375px)"
              className={`p-1 rounded ${deviceMode === 'mobile' ? 'bg-neutral-800 text-white font-medium' : 'hover:text-white'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onRefresh}
            title="Reload Preview Frame"
            className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors text-xs flex items-center gap-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden md:inline">Reload</span>
          </button>

          <button
            onClick={handleOpenNewWindow}
            title="Pop out in new tab"
            className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 flex items-center justify-center bg-[#09090b] overflow-hidden p-0 sm:p-2">
        <div className={`h-full ${getDeviceWidthClass()} transition-all duration-200 bg-black flex flex-col shadow-2xl ${deviceMode !== 'full' ? 'border border-neutral-800 rounded-lg overflow-hidden' : ''}`}>
          <iframe
            ref={iframeRef}
            title="Output Sandbox Preview"
            sandbox="allow-scripts allow-modals allow-same-origin"
            className="w-full flex-1 border-none bg-black"
          />
        </div>
      </div>

      {/* Built-in Console Drawer */}
      <ConsoleDrawer
        logs={consoleLogs}
        onClear={onClearLogs}
        isOpen={isConsoleOpen}
        onToggle={() => setIsConsoleOpen(!isConsoleOpen)}
      />
    </div>
  );
};
