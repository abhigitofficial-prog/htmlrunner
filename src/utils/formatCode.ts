/**
 * Lightweight, robust offline code formatters for HTML, CSS, and JS
 */

export function formatHTML(html: string): string {
  const tab = '  ';
  let result = '';
  let indent = 0;
  
  // Normalize whitespace around tags
  const tokens = html
    .replace(/>\s*</g, '><')
    .replace(/</g, '\n<')
    .replace(/>/g, '>\n')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  for (const token of tokens) {
    if (token.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      result += tab.repeat(indent) + token + '\n';
    } else if (token.startsWith('<') && !token.startsWith('<!') && !token.startsWith('<?')) {
      const tagMatch = token.match(/<([a-zA-Z0-9-]+)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
      const isSelfClosing = token.endsWith('/>') || voidTags.has(tagName);

      result += tab.repeat(indent) + token + '\n';
      if (!isSelfClosing) {
        indent++;
      }
    } else {
      result += tab.repeat(indent) + token + '\n';
    }
  }

  return result.trim();
}

export function formatCSS(css: string): string {
  const tab = '  ';
  let formatted = '';
  let indent = 0;

  // Clean extra spaces
  const clean = css
    .replace(/\s+/g, ' ')
    .replace(/\{\s*/g, ' {\n')
    .replace(/;\s*/g, ';\n')
    .replace(/\s*\}\s*/g, '\n}\n')
    .trim();

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (line === '}') {
      indent = Math.max(0, indent - 1);
      formatted += tab.repeat(indent) + line + '\n\n';
    } else if (line.endsWith('{')) {
      formatted += tab.repeat(indent) + line + '\n';
      indent++;
    } else {
      formatted += tab.repeat(indent) + line + '\n';
    }
  }

  return formatted.trim();
}

export function formatJS(js: string): string {
  const tab = '  ';
  let formatted = '';
  let indent = 0;

  const lines = js.split('\n');

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      formatted += '\n';
      continue;
    }

    if (line.startsWith('}') || line.startsWith(']') || line.startsWith(')')) {
      indent = Math.max(0, indent - 1);
    }

    formatted += tab.repeat(indent) + line + '\n';

    const opens = (line.match(/[\{\[\(]/g) || []).length;
    const closes = (line.match(/[\}\]\)]/g) || []).length;
    indent = Math.max(0, indent + (opens - closes));
  }

  return formatted.trim();
}
