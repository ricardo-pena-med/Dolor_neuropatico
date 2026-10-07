import React from 'react';

function inline(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong> : part);
}

export default function MarkdownText({ text }: { text: string }) {
  return <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-2">
    {text.split('\n').map((line, i) => {
      if (/^#{1,3} /.test(line)) return <h3 key={i} className="font-semibold mt-4 mb-2">{inline(line.replace(/^#{1,3} /, ''))}</h3>;
      if (/^[*-] /.test(line)) return <p key={i} className="ml-4">• {inline(line.slice(2))}</p>;
      return line.trim() ? <p key={i}>{inline(line)}</p> : null;
    })}
  </div>;
}
