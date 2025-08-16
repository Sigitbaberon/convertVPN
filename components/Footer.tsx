
import React from 'react';

export function Footer(): React.ReactNode {
  return (
    <footer className="text-center p-6 text-xs text-slate-500 border-t border-slate-700/50 mt-8">
      <p>Raxnet Tools &copy; {new Date().getFullYear()}. Built for Cloudflare Pages.</p>
      <p className="mt-1">This is a frontend tool. All conversions happen locally in your browser for privacy.</p>
    </footer>
  );
}
