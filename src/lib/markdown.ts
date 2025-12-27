export function stripMarkdown(text: string): string {
  if (!text) return '';

  return text
    .replace(/^#+\s+(.+)$/gm, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1')
    .replace(/^[\-\*]\s+(.+)$/gm, '$1')
    .replace(/^\d+\.\s+(.+)$/gm, '$1')
    .replace(/^>\s*(.+)$/gm, '$1')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^---$/gm, '')
    .trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderMarkdown(text: string): string {
  if (!text) return '';

  const codeBlocks: string[] = [];
  let html = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre class="code-block" data-lang="${lang || 'text'}"><code>${escapeHtml(code.trim())}</code></pre>`);
    return `__CODE_BLOCK_${idx}__`;
  });

  const inlineCode: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const idx = inlineCode.length;
    inlineCode.push(`<code class="inline-code">${escapeHtml(code)}</code>`);
    return `__INLINE_CODE_${idx}__`;
  });

  html = html.replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>');

  html = html.replace(/^---$/gm, '<hr class="md-hr">');

  html = html.replace(/^>\s*(.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote class="md-blockquote">/g, '\n');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="md-strong">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="md-em">$1</em>');

  html = html.replace(/\[(.+?)\]\(\/([^)]+)\)/g, '<a href="/$2" class="md-link md-internal-link">$1</a>');
  html = html.replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" class="md-link md-external-link" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/\[(.+?)\]\(([^)]+)\)/g, '<a href="$2" class="md-link">$1</a>');

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="md-figure"><img src="$2" alt="$1" class="md-image" loading="lazy"><figcaption class="md-figcaption">$1</figcaption></figure>');

  const lines = html.split('\n');
  const result: string[] = [];
  let inList: 'ul' | 'ol' | null = null;
  let listItems: string[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      result.push(`<${inList} class="md-list md-${inList}">`);
      listItems.forEach(item => result.push(item));
      result.push(`</${inList}>`);
      listItems = [];
      inList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.match(/^[\-\*]\s+(.+)/)) {
      if (inList !== 'ul') {
        flushList();
        inList = 'ul';
      }
      const content = trimmed.replace(/^[\-\*]\s+(.+)/, '$1');
      listItems.push(`<li class="md-li">${content}</li>`);
    } else if (trimmed.match(/^\d+\.\s+(.+)/)) {
      if (inList !== 'ol') {
        flushList();
        inList = 'ol';
      }
      const content = trimmed.replace(/^\d+\.\s+(.+)/, '$1');
      listItems.push(`<li class="md-li">${content}</li>`);
    } else {
      flushList();

      if (trimmed === '') {
        if (result.length > 0 && !result[result.length - 1].match(/<\/(h[1-4]|ul|ol|pre|blockquote|hr|figure)>/)) {
          result.push('<div class="md-spacer"></div>');
        }
      } else if (!trimmed.startsWith('<h') && !trimmed.startsWith('<blockquote') && !trimmed.startsWith('<hr') && !trimmed.startsWith('<figure') && !trimmed.startsWith('__CODE_BLOCK')) {
        result.push(`<p class="md-p">${trimmed}</p>`);
      } else {
        result.push(line);
      }
    }
  }

  flushList();

  html = result.join('\n');

  codeBlocks.forEach((block, idx) => {
    html = html.replace(`__CODE_BLOCK_${idx}__`, block);
  });

  inlineCode.forEach((code, idx) => {
    html = html.replace(`__INLINE_CODE_${idx}__`, code);
  });

  html = html.replace(/<p class="md-p">(<pre|<h[1-4]|<ul|<ol|<blockquote|<hr|<figure)/g, '$1');
  html = html.replace(/(<\/pre>|<\/h[1-4]>|<\/ul>|<\/ol>|<\/blockquote>|<\/figure>)<\/p>/g, '$1');

  return html;
}

export function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = stripMarkdown(text).split(/\s+/).filter(w => w.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function generateExcerpt(text: string, maxLength: number = 160): string {
  const stripped = stripMarkdown(text);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}
