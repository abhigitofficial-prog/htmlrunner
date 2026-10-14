/**
 * Bundles HTML, CSS, and JavaScript with runtime sandbox instrumentation
 */

export function combineCode(html: string, css: string, js: string): string {
  // Console hook and error interceptor script to be injected into the preview iframe
  const consoleHookScript = `
    <script>
      (function() {
        const _post = function(type, content) {
          try {
            window.parent.postMessage({
              source: 'SANDBOX_IFRAME',
              type: type,
              content: content,
              timestamp: new Date().toLocaleTimeString()
            }, '*');
          } catch(e) {}
        };

        const _formatArg = function(arg) {
          if (arg === null) return 'null';
          if (arg === undefined) return 'undefined';
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch(e) {
              return Object.prototype.toString.call(arg);
            }
          }
          return String(arg);
        };

        const origLog = console.log;
        const origInfo = console.info;
        const origWarn = console.warn;
        const origError = console.error;

        console.log = function(...args) {
          origLog.apply(console, args);
          _post('log', args.map(_formatArg).join(' '));
        };

        console.info = function(...args) {
          origInfo.apply(console, args);
          _post('info', args.map(_formatArg).join(' '));
        };

        console.warn = function(...args) {
          origWarn.apply(console, args);
          _post('warn', args.map(_formatArg).join(' '));
        };

        console.error = function(...args) {
          origError.apply(console, args);
          _post('error', args.map(_formatArg).join(' '));
        };

        window.onerror = function(message, source, lineno, colno, error) {
          _post('error', 'Uncaught ' + message + (lineno ? ' (Line ' + lineno + ')' : ''));
          return false;
        };

        window.addEventListener('unhandledrejection', function(event) {
          _post('error', 'Unhandled Promise Rejection: ' + (event.reason ? _formatArg(event.reason) : 'Unknown reason'));
        });
      })();
    </script>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
  ${consoleHookScript}
  <style>
    /* Default dark canvas preview styling if empty */
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch (err) {
      console.error(err.message || String(err));
    }
  </script>
</body>
</html>`;
}

/**
 * Generates a clean standalone HTML file without development instrumentation
 */
export function generateCleanExport(html: string, css: string, js: string, title = 'Web Project'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
${css}
  </style>
</head>
<body>
${html}

  <script>
${js}
  </script>
</body>
</html>`;
}

/**
 * Generates a complete standalone single HTML file containing the entire Code Editor application
 * in pure HTML, CSS, and vanilla JS that runs 100% offline in any browser!
 */
export function generateStandaloneOfflineEditorHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AetherCode — Offline Live Code Studio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #000000; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
    header { height: 48px; background: #09090b; border-bottom: 1px solid #27272a; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
    .brand { font-weight: 700; font-size: 14px; letter-spacing: -0.01em; display: flex; align-items: center; gap: 8px; }
    .brand span { color: #f97316; }
    .main-workspace { flex: 1; display: flex; overflow: hidden; }
    .editors-pane { flex: 1; display: flex; flex-direction: column; border-right: 1px solid #27272a; background: #09090b; }
    .tabs-bar { display: flex; background: #09090b; border-bottom: 1px solid #27272a; }
    .tab-btn { padding: 8px 16px; background: none; border: none; color: #71717a; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }
    .tab-btn.active { color: #fff; background: #18181b; }
    .tab-btn.html.active { border-bottom: 2px solid #f97316; }
    .tab-btn.css.active { border-bottom: 2px solid #38bdf8; }
    .tab-btn.js.active { border-bottom: 2px solid #eab308; }
    .editor-wrapper { flex: 1; position: relative; }
    textarea { width: 100%; height: 100%; background: #000000; color: #f4f4f5; border: none; padding: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; line-height: 1.6; resize: none; outline: none; }
    .preview-pane { flex: 1; display: flex; flex-direction: column; background: #000000; }
    .preview-header { height: 36px; background: #09090b; border-bottom: 1px solid #27272a; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; font-size: 11px; color: #71717a; }
    iframe { flex: 1; border: none; background: #000; }
    footer { height: 48px; background: #09090b; border-top: 1px solid #27272a; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
    .btn-run { background: #ffffff; color: #000000; font-weight: 700; font-size: 12px; padding: 6px 16px; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; }
    .btn-run:hover { background: #e4e4e7; }
    .live-toggle { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #a1a1aa; cursor: pointer; }
    .live-toggle input { accent-color: #22c55e; }
  </style>
</head>
<body>
  <header>
    <div class="brand">AetherCode <span>·</span> Studio</div>
    <div style="font-size: 11px; color: #71717a;">Offline Standalone Edition</div>
  </header>
  <div class="main-workspace">
    <div class="editors-pane">
      <div class="tabs-bar">
        <button class="tab-btn html active" onclick="switchTab('html')">HTML</button>
        <button class="tab-btn css" onclick="switchTab('css')">CSS</button>
        <button class="tab-btn js" onclick="switchTab('js')">JS</button>
      </div>
      <div class="editor-wrapper">
        <textarea id="code-html" placeholder="Write HTML here..."><div class="welcome">
  <h1>Offline Live Studio</h1>
  <p>Modify HTML, CSS and JS to see instant real-time results.</p>
  <button id="click-me">Click Counter: 0</button>
</div></textarea>
        <textarea id="code-css" style="display:none;" placeholder="Write CSS here...">body {
  background: #09090b;
  color: #fff;
  font-family: sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
}
.welcome {
  text-align: center;
  padding: 32px;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
}
h1 { margin-bottom: 8px; font-size: 24px; }
p { color: #a1a1aa; margin-bottom: 20px; font-size: 14px; }
button {
  background: #f97316;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}</textarea>
        <textarea id="code-js" style="display:none;" placeholder="Write JavaScript here...">let count = 0;
const btn = document.getElementById('click-me');
btn.addEventListener('click', () => {
  count++;
  btn.textContent = 'Click Counter: ' + count;
});</textarea>
      </div>
    </div>
    <div class="preview-pane">
      <div class="preview-header">
        <span>PREVIEW SANDBOX</span>
        <span id="render-status">Ready</span>
      </div>
      <iframe id="preview-frame" sandbox="allow-scripts allow-modals"></iframe>
    </div>
  </div>
  <footer>
    <label class="live-toggle">
      <input type="checkbox" id="live-check" checked onchange="toggleLive()">
      <span>Live Preview</span>
    </label>
    <button class="btn-run" onclick="updatePreview()">▶ Run Code</button>
  </footer>
  <script>
    let activeTab = 'html';
    const htmlEl = document.getElementById('code-html');
    const cssEl = document.getElementById('code-css');
    const jsEl = document.getElementById('code-js');
    const iframe = document.getElementById('preview-frame');
    const liveCheck = document.getElementById('live-check');
    const statusEl = document.getElementById('render-status');

    function switchTab(tab) {
      activeTab = tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.tab-btn.' + tab).classList.add('active');
      htmlEl.style.display = tab === 'html' ? 'block' : 'none';
      cssEl.style.display = tab === 'css' ? 'block' : 'none';
      jsEl.style.display = tab === 'js' ? 'block' : 'none';
    }

    function updatePreview() {
      const doc = '<!DOCTYPE html><html><head><style>' + cssEl.value + '<\\/style><\\/head><body>' + htmlEl.value + '<script>' + jsEl.value + '<\\/script><\\/body><\\/html>';
      iframe.srcdoc = doc;
      statusEl.textContent = 'Updated ' + new Date().toLocaleTimeString();
    }

    let debounceTimer;
    function handleInput() {
      if (!liveCheck.checked) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updatePreview, 350);
    }

    [htmlEl, cssEl, jsEl].forEach(el => {
      el.addEventListener('input', handleInput);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = el.selectionStart;
          el.value = el.value.substring(0, start) + '  ' + el.value.substring(el.selectionEnd);
          el.selectionStart = el.selectionEnd = start + 2;
          handleInput();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          updatePreview();
        }
      });
    });

    function toggleLive() {
      if (liveCheck.checked) updatePreview();
    }

    updatePreview();
  </script>
</body>
</html>`;
}
