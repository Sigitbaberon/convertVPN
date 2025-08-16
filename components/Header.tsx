
import React from 'react';

export function Header(): React.ReactNode {
  return (
    <header className="text-center p-4 md:p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-20">
      <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
        Raxnet Tools
      </h1>
      <p className="text-slate-400 mt-2 text-sm md:text-base">
        VPN Configuration Converter (VMess, VLESS, Trojan to YAML)
      </p>
    </header>
  );
}
