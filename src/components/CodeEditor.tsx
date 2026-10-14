import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check, RotateCcw, AlignLeft, WrapText } from 'lucide-react';
import { Language } from '../types';
import { formatHTML, formatCSS, formatJS } from '../utils/formatCode';

interface CodeEditorProps {
  language: Language;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  accentColor: string;
  badgeText: string;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  label,
  value,
  onChange,
  onRun,
  accentColor,
  badgeText,
  className = ''
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [lastCleared, setLastCleared] = useState<string | null>(null);

  // Calculate lines
  const lines = value.split('\n');
  const lineCount = lines.length;

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleFormat = () => {
    let formatted = value;
    if (language === 'html') formatted = formatHTML(value);
    else if (language === 'css') formatted = formatCSS(value);
    else if (language === 'js') formatted = formatJS(value);
    onChange(formatted);
  };

  const handleClear = () => {
    if (value.trim()) {
      setLastCleared(value);
      onChange('');
    }
  };

  const handleUndoClear = () => {
    if (lastCleared !== null) {
      onChange(lastCleared);
      setLastCleared(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Run shortcut: Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onRun) onRun();
      return;
    }

    // Tab key handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Shift + Tab: Unindent
        const linesBefore = value.substring(0, start).split('\n');
        const currentLineIndex = linesBefore.length - 1;
        const allLines = value.split('\n');
        const currentLine = allLines[currentLineIndex];

        if (currentLine.startsWith('  ')) {
          allLines[currentLineIndex] = currentLine.substring(2);
          const nextValue = allLines.join('\n');
          onChange(nextValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(0, start - 2);
          }, 0);
        }
      } else {
        // Tab: Insert 2 spaces
        const nextValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(nextValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
      return;
    }

    // Auto closing pairs
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`'
    };

    if (pairs[e.key] && textarea.selectionStart === textarea.selectionEnd) {
      const start = textarea.selectionStart;
      const closing = pairs[e.key];
      e.preventDefault();
      const nextValue = value.substring(0, start) + e.key + closing + value.substring(start);
      onChange(nextValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }

    // Auto indent on Enter
    if (e.key === 'Enter') {
      const start = textarea.selectionStart;
      const linesBefore = value.substring(0, start).split('\n');
      const currentLine = linesBefore[linesBefore.length - 1];
      const match = currentLine.match(/^\s+/);
      const indent = match ? match[0] : '';
      
      const extraIndent = currentLine.trim().endsWith('{') || currentLine.trim().endsWith('(') || currentLine.trim().endsWith('>') ? '  ' : '';

      if (indent || extraIndent) {
        e.preventDefault();
        const addition = '\n' + indent + extraIndent;
        const nextValue = value.substring(0, start) + addition + value.substring(start);
        onChange(nextValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + addition.length;
        }, 0);
      }
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[#09090b] text-neutral-200 border border-neutral-800/80 overflow-hidden ${className}`}>
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0d0d10] border-b border-neutral-800/90 select-none">
        <div className="flex items-center gap-2">
          <span 
            className="w-2.5 h-2.5 rounded-full inline-block" 
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-xs font-semibold tracking-wide text-neutral-200">{label}</span>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
            {badgeText}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-neutral-400">
          <button
            onClick={handleFormat}
            title="Format Code"
            className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors text-xs flex items-center gap-1"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Format</span>
          </button>

          <button
            onClick={() => setWordWrap(!wordWrap)}
            title={wordWrap ? 'Disable Word Wrap' : 'Enable Word Wrap'}
            className={`p-1 rounded transition-colors ${wordWrap ? 'text-amber-400 bg-neutral-800' : 'hover:text-white hover:bg-neutral-800'}`}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            title="Copy to Clipboard"
            className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {lastCleared !== null ? (
            <button
              onClick={handleUndoClear}
              title="Restore cleared code"
              className="p-1 text-amber-400 hover:bg-neutral-800 rounded transition-colors text-[11px] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore</span>
            </button>
          ) : (
            <button
              onClick={handleClear}
              title="Clear Editor"
              className="p-1 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors text-[11px]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative bg-[#000000]">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-11 pt-3 pb-6 pr-2.5 text-right font-code text-xs text-neutral-600 select-none bg-[#050507] border-r border-neutral-900 overflow-hidden tabular-nums leading-6"
        >
          {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => (
            <div key={i} className="h-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap={wordWrap ? 'on' : 'off'}
          placeholder={`Enter ${label} code here...`}
          className="flex-1 h-full p-3 bg-transparent text-neutral-100 font-code text-xs md:text-[13px] leading-6 resize-none outline-none border-none selection:bg-neutral-800 selection:text-white overflow-auto"
        />
      </div>

      {/* Editor Footer Stats */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#09090b] border-t border-neutral-900 text-[10px] text-neutral-500 font-code select-none">
        <div className="flex items-center gap-3">
          <span>{lineCount} lines</span>
          <span>{value.length} chars</span>
        </div>
        <div>
          <span>Tab: 2 spaces</span>
        </div>
      </div>
    </div>
  );
};
