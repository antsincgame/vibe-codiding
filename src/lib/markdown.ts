export function stripMarkdown(text: string): string {
  if (!text) return '';

  return text
    .replace(/^#+\s+(.+)$/gm, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1')
    .replace(/^[\-\*]\s+(.+)$/gm, '$1')
    .replace(/^\d+\.\s+(.+)$/gm, '$1')
    .trim();
}

export function renderMarkdown(text: string): string {
  if (!text) return '';

  let html = text;

  html = html.replace(/^### (.+)$/gm, '<h3 style="font-size: 24px; color: var(--neon-green); margin: 25px 0 15px 0;">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="font-size: 28px; color: var(--neon-cyan); margin: 30px 0 20px 0;">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="font-size: 32px; color: var(--neon-pink); margin: 35px 0 20px 0;">$1</h1>');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 700; color: var(--neon-cyan);">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em style="font-style: italic; opacity: 0.9;">$1</em>');

  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color: var(--neon-cyan); text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>');

  const lines = html.split('\n');
  let inList = false;
  let result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^[\-\*] (.+)/)) {
      if (!inList) {
        result.push('<ul style="margin: 15px 0; padding-left: 25px; list-style: none;">');
        inList = true;
      }
      const content = line.replace(/^[\-\*] (.+)/, '$1');
      result.push(`<li style="margin: 8px 0; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: var(--neon-green);">•</span>${content}</li>`);
    } else if (line.match(/^\d+\. (.+)/)) {
      if (!inList) {
        result.push('<ol style="margin: 15px 0; padding-left: 25px;">');
        inList = true;
      }
      const content = line.replace(/^\d+\. (.+)/, '$1');
      result.push(`<li style="margin: 8px 0;">${content}</li>`);
    } else {
      if (inList) {
        result.push(line.includes('ol') ? '</ol>' : '</ul>');
        inList = false;
      }
      if (line.trim() === '') {
        result.push('<br>');
      } else {
        result.push(line);
      }
    }
  }

  if (inList) {
    result.push('</ul>');
  }

  return result.join('\n');
}
