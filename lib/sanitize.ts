// Minimal HTML allowlist sanitizer for trusted-admin rich-text input.
// Defense-in-depth on top of the JWT-gated PUT /api/profile route.

const ALLOWED_TAGS = new Set([
  'b', 'strong', 'i', 'em', 'u', 'a', 'br',
  'p', 'div', 'span', 'ul', 'ol', 'li',
]);

const ALLOWED_ATTRS_PER_TAG: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
};

const URL_SAFE = /^(https?:\/\/|mailto:|tel:|\/)/i;

export function sanitizeRichHtml(input: unknown): string {
  if (typeof input !== 'string') return '';

  let html = input;

  // Drop entire <script>/<style> blocks.
  html = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');

  // Strip inline event handlers (onclick=...).
  html = html.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Walk every tag; drop disallowed ones (keeping their text content),
  // and on allowed tags filter attributes by allowlist.
  html = html.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g,
    (match, rawTag: string, rawAttrs: string) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return '';
      if (match.startsWith('</')) return `</${tag}>`;

      const allowed = ALLOWED_ATTRS_PER_TAG[tag];
      if (!allowed) return `<${tag}>`;

      const kept: string[] = [];
      const attrRe = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g;
      let m: RegExpExecArray | null;
      while ((m = attrRe.exec(rawAttrs)) !== null) {
        const name = m[1].toLowerCase();
        const value = m[3] ?? m[4] ?? m[5] ?? '';
        if (!allowed.has(name)) continue;
        if (name === 'href' && !URL_SAFE.test(value)) continue;
        const escaped = value.replace(/"/g, '&quot;');
        kept.push(`${name}="${escaped}"`);
      }

      // Force safe rel/target on links.
      if (tag === 'a') {
        const hasHref = kept.some((a) => a.startsWith('href='));
        if (hasHref) {
          if (!kept.some((a) => a.startsWith('target='))) kept.push('target="_blank"');
          if (!kept.some((a) => a.startsWith('rel='))) kept.push('rel="noopener noreferrer"');
        }
      }

      return `<${tag}${kept.length ? ' ' + kept.join(' ') : ''}>`;
    },
  );

  return html;
}
