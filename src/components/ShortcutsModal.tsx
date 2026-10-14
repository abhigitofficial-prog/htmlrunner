import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';
  const altKey = isMac ? '⌥' : 'Alt';

  const shortcuts = [
    { key: `${modKey} + Enter`, desc: 'Run code & compile to preview' },
    { key: 'Tab', desc: 'Indent selection by 2 spaces' },
    { key: 'Shift + Tab', desc: 'Unindent selection by 2 spaces' },
    { key: `${altKey} + 1`, desc: 'Switch to HTML editor' },
    { key: `${altKey} + 2`, desc: 'Switch to CSS editor' },
    { key: `${altKey} + 3`, desc: 'Switch to JavaScript editor' },
    { key: 'Esc', desc: 'Close modals & popups' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#0d0d10] border border-neutral-800 rounded-xl shadow-2xl p-6 text-neutral-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-neutral-300" />
            <h2 className="text-base font-semibold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-neutral-900 text-sm">
              <span className="text-neutral-400">{s.desc}</span>
              <kbd className="px-2 py-1 bg-neutral-900 border border-neutral-700/80 rounded font-mono text-xs text-neutral-200 shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
