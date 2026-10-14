import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  Eye, 
  Columns, 
  BookOpen, 
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sparkles
} from 'lucide-react';

const STARTER_CODE = `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      margin: 0;
      color: #333333;
      background-color: #ffffff;
      line-height: 1.5;
    }
    h1 {
      color: #0284c7;
      margin-top: 0;
      font-size: 26px;
    }
    p {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 20px;
    }
    .my-btn {
      background-color: #0284c7;
      color: white;
      border: none;
      padding: 12px 20px;
      font-size: 15px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
    }
    .my-btn:active {
      background-color: #0369a1;
    }
  </style>
</head>
<body>

  <h1>Hello World!</h1>
  <p>Welcome to HTML! Edit this code and see your webpage change on your phone.</p>

  <button class="my-btn" onclick="alert('Great job learning HTML!')">
    Tap Me!
  </button>

</body>
</html>`;

const LESSONS = [
  {
    title: '1. Hello World',
    desc: 'The simplest webpage with title and text',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Hello</title>
</head>
<body style="font-family: Arial; padding: 20px; color: #111;">
  <h1>Hello World!</h1>
  <p>This is my first website on my phone.</p>
</body>
</html>`
  },
  {
    title: '2. Text & Colors',
    desc: 'Headings, colored text, bold and italics',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Colors & Fonts</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    h1 { color: #dc2626; font-size: 24px; }
    h2 { color: #2563eb; font-size: 20px; }
    p { font-size: 16px; line-height: 1.6; }
    .highlight { background: #fef08a; padding: 2px 6px; }
  </style>
</head>
<body>
  <h1>Big Red Title</h1>
  <h2>Blue Subtitle</h2>
  <p>You can make words <span class="highlight">highlighted</span>, <b>bold</b>, or <i>italic</i> easily.</p>
</body>
</html>`
  },
  {
    title: '3. Lists & Links',
    desc: 'Bullet points and clickable links',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>My List</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    ul { background: #f3f4f6; padding: 20px 35px; border-radius: 10px; }
    li { margin: 10px 0; font-size: 16px; }
  </style>
</head>
<body>
  <h2>Things I Like:</h2>
  <ul>
    <li>Coding on my phone</li>
    <li>Making games & websites</li>
    <li>Listening to music</li>
  </ul>
</body>
</html>`
  },
  {
    title: '4. Beautiful Card',
    desc: 'A modern card box with button',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Card</title>
  <style>
    body {
      background-color: #f1f5f9;
      font-family: Arial, sans-serif;
      padding: 30px 16px;
      display: flex;
      justify-content: center;
    }
    .box {
      background: white;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      max-width: 320px;
      width: 100%;
      text-align: center;
    }
    h2 { color: #0f172a; margin-top: 0; }
    p { color: #64748b; font-size: 14px; margin-bottom: 20px; }
    button {
      background: #10b981;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: bold;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="box">
    <h2>Student Project</h2>
    <p>Built with HTML & CSS right on my mobile phone!</p>
    <button onclick="alert('Nice work!')">Success Button</button>
  </div>
</body>
</html>`
  },
  {
    title: '5. Blank Page',
    desc: 'Empty canvas for your own code',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>New Page</title>
</head>
<body style="font-family: Arial; padding: 20px;">
  <h1>Start writing here</h1>
  <p>Add your own tags and styles!</p>
</body>
</html>`
  }
];

// Quick shortcut keys for easy mobile phone typing
const MOBILE_QUICK_TAGS = [
  '<', '>', '/', '"', '=', '{', '}', ';',
  '<h1>', '<p>', '<button>', '<style>', 'class=""', 'id=""'
];

export default function App() {
  const [code, setCode] = useState<string>(() => {
    return localStorage.getItem('phone_html_code') ?? STARTER_CODE;
  });

  // Mobile view modes: 'code' | 'preview' | 'split'
  const [activeView, setActiveView] = useState<'code' | 'preview' | 'split'>('code');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(14);
  const [copied, setCopied] = useState(false);
  const [showLessons, setShowLessons] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('phone_html_code', code);
  }, [code]);

  // Render preview into the iframe
  const runCode = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = code;
    }
    setHasChanges(false);
  }, [code]);

  // Initial mount render
  useEffect(() => {
    runCode();
  }, []);

  // Live preview typing debounce
  useEffect(() => {
    setHasChanges(true);
    if (!isLive) return;

    const timer = setTimeout(() => {
      runCode();
    }, 280);

    return () => clearTimeout(timer);
  }, [code, isLive, runCode]);

  // Insert helper characters at cursor (Mobile Quick Tags)
  const insertTextAtCursor = (insertText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextCode = code.substring(0, start) + insertText + code.substring(end);
    setCode(nextCode);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newPos = start + insertText.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 10);
  };

  // Keyboard shortcut helper for desktop / Bluetooth keyboards
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      insertTextAtCursor('  ');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setCode(STARTER_CODE);
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = STARTER_CODE;
      }
    }, 50);
  };

  // When clicking "Run" in mobile Code view, optionally switch to Preview to see results
  const handleRunAndPreview = () => {
    runCode();
    if (window.innerWidth < 768 && activeView === 'code') {
      // Auto-switch to preview so phone user immediately sees their output!
      setActiveView('preview');
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen bg-[#000000] text-neutral-100 overflow-hidden font-sans select-none">
      {/* Mobile-Friendly Top Bar */}
      <header className="h-13 bg-[#09090b] border-b border-neutral-800 px-3 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white leading-none">HTML Runner</h1>
            <p className="text-[10px] text-neutral-400 mt-0.5">Mobile & Beginner</p>
          </div>
        </div>

        {/* View Switcher: Code / Preview / Split */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
          <button
            onClick={() => setActiveView('code')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeView === 'code'
                ? 'bg-neutral-800 text-orange-400 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>

          <button
            onClick={() => {
              runCode();
              setActiveView('preview');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeView === 'preview'
                ? 'bg-neutral-800 text-emerald-400 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => setActiveView('split')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all hidden md:flex items-center gap-1 ${
              activeView === 'split'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Lessons / Examples Modal Toggle */}
          <button
            onClick={() => setShowLessons(!showLessons)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-800 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Examples</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset code"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownload}
            title="Download .html file"
            className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Examples Modal / Drawer for Phone */}
      {showLessons && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#18181b] border border-neutral-700 rounded-2xl p-5 shadow-2xl text-neutral-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-700 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Choose a Beginner Example</h3>
              </div>
              <button
                onClick={() => setShowLessons(false)}
                className="text-neutral-400 hover:text-white text-xs px-2 py-1 rounded bg-neutral-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {LESSONS.map((lesson, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCode(lesson.code);
                    setShowLessons(false);
                    setTimeout(() => {
                      runCode();
                    }, 50);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all"
                >
                  <div className="font-semibold text-xs text-white mb-0.5">{lesson.title}</div>
                  <div className="text-[11px] text-neutral-400">{lesson.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Quick Characters & Tags Bar (Shown when in Code View) */}
      {(activeView === 'code' || activeView === 'split') && (
        <div className="h-10 bg-[#121215] border-b border-neutral-800/80 px-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none">
          <span className="text-[10px] text-neutral-500 uppercase font-mono px-1 shrink-0">
            Quick Keys:
          </span>
          {MOBILE_QUICK_TAGS.map((tag, i) => (
            <button
              key={i}
              type="button"
              onClick={() => insertTextAtCursor(tag)}
              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 active:bg-orange-500/20 active:text-orange-300 text-neutral-300 border border-neutral-800 rounded-md text-xs font-code shrink-0 transition-colors shadow-sm"
            >
              {tag}
            </button>
          ))}

          {/* Font Size controls */}
          <div className="ml-auto flex items-center gap-1 pl-2 border-l border-neutral-800 shrink-0">
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.max(12, s - 1))}
              className="p-1 text-neutral-400 hover:text-white rounded"
              title="Smaller font"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-neutral-400 font-mono w-4 text-center">{fontSize}</span>
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.min(20, s + 1))}
              className="p-1 text-neutral-400 hover:text-white rounded"
              title="Larger font"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Code Editor Panel */}
        <div
          className={`flex-1 flex flex-col bg-[#000000] overflow-hidden ${
            activeView === 'preview' ? 'hidden md:hidden' : 'flex'
          }`}
        >
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            style={{ fontSize: `${fontSize}px` }}
            placeholder="Type your <html> code here..."
            className="flex-1 w-full h-full p-3.5 bg-[#000000] text-neutral-100 font-code leading-relaxed resize-none outline-none border-none selection:bg-neutral-800 selection:text-white overflow-auto"
          />
        </div>

        {/* White Preview Window */}
        <div
          className={`flex-1 flex flex-col bg-white overflow-hidden border-t md:border-t-0 md:border-l border-neutral-800 ${
            activeView === 'code' ? 'hidden md:hidden' : 'flex'
          }`}
        >
          {/* Browser Address Bar Mockup */}
          <div className="h-8 bg-[#f1f3f5] border-b border-neutral-300 px-3 flex items-center justify-between text-neutral-600 select-none shrink-0">
            <div className="flex items-center gap-1.5 flex-1 max-w-xs bg-white px-2.5 py-0.5 rounded border border-neutral-300 text-[11px] font-mono text-neutral-500 truncate shadow-2xs">
              <span className="text-emerald-600">https://</span>
              <span>my-webpage.html</span>
            </div>
            <button
              onClick={runCode}
              title="Reload preview"
              className="p-1 text-neutral-500 hover:text-black rounded transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pure White Output Canvas */}
          <div className="flex-1 bg-white p-0 overflow-hidden relative">
            <iframe
              ref={iframeRef}
              title="Output Webpage"
              sandbox="allow-scripts allow-modals"
              className="w-full h-full border-none bg-white text-black"
            />
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Bottom Action Bar */}
      <footer className="h-15 bg-[#09090b] border-t border-neutral-800 px-3.5 flex items-center justify-between text-neutral-300 select-none shrink-0 z-30 pb-safe">
        {/* Left: Live toggle & Copy */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
              className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
            />
            <span className="text-xs font-medium text-neutral-200">
              Live Preview
            </span>
          </label>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded text-xs transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Right: Big Thumb-Friendly Run Button */}
        <button
          onClick={handleRunAndPreview}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black font-bold text-sm shadow-lg shadow-emerald-950/40 active:scale-95 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current text-black" />
          <span>Run Code</span>
          {activeView === 'code' && (
            <span className="text-[10px] font-normal opacity-80 hidden xs:inline">&rarr; Preview</span>
          )}
        </button>
      </footer>
    </div>
  );
}
