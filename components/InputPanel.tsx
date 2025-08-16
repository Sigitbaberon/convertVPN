
import React from 'react';
import { ConvertIcon, ClearIcon, LoaderIcon, DocumentTextIcon } from './icons';

interface InputPanelProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onConvert: () => void;
  onClear: () => void;
  onLoadSample: () => void;
  isLoading: boolean;
}

export function InputPanel({ value, onChange, onConvert, onClear, onLoadSample, isLoading }: InputPanelProps): React.ReactNode {
  return (
    <div className="flex flex-col bg-slate-800/60 rounded-xl border border-slate-700/50 p-4 backdrop-blur-md shadow-2xl shadow-black/20 sticky top-28">
      <h2 className="text-lg font-semibold text-slate-200 mb-3">Input Configurations</h2>
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Paste your vmess://, vless://, or trojan:// links here, one per line."
        className="flex-grow w-full h-80 bg-slate-900/70 border border-slate-700 rounded-md p-3 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-y"
        spellCheck="false"
        disabled={isLoading}
      />
      <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
         <div className="flex items-center gap-3">
             <button
              onClick={onLoadSample}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-md transition duration-200 text-sm"
              title="Load sample configurations"
            >
              <DocumentTextIcon />
              Load Sample
            </button>
            <button
              onClick={onClear}
              disabled={isLoading || !value}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 hover:bg-rose-600/50 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-md transition duration-200 text-sm"
              title="Clear all input"
            >
              <ClearIcon />
              Clear
            </button>
         </div>
        <button
          onClick={onConvert}
          disabled={isLoading || !value}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 disabled:from-cyan-800/50 disabled:to-teal-900/50 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-md transition duration-200 shadow-lg shadow-cyan-500/20"
        >
          {isLoading ? <LoaderIcon /> : <ConvertIcon />}
          {isLoading ? 'Converting...' : 'Convert to YAML'}
        </button>
      </div>
    </div>
  );
}
