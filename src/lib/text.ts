/**
 * Plain text (from Google Calendar) to safe HTML: escapes everything, turns web
 * addresses into links, and keeps paragraphs and line breaks.
 */
export function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((para) => `<p>${linkify(para).replace(/\n/g, '<br />')}</p>`)
    .join('');
}

const URL_RE = /https?:\/\/[^\s<>()"']+[^\s<>()"'.,;:!?]/g;

/** Escapes the text and wraps each web address in a link. */
function linkify(text: string): string {
  let html = '';
  let last = 0;
  for (const match of text.matchAll(URL_RE)) {
    const url = match[0];
    const label = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    html += escape(text.slice(last, match.index));
    html += `<a href="${escape(url)}" target="_blank" rel="noopener">${escape(label.length > 48 ? `${label.slice(0, 45)}…` : label)}</a>`;
    last = match.index + url.length;
  }
  return html + escape(text.slice(last));
}

function escape(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** "https://www.theguardian.com/…" → "theguardian.com" */
export function hostOf(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '');
}
