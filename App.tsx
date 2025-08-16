
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { Footer } from './components/Footer';
import { processInput } from './services/converter';
import type { ConversionResult } from './types';

const SAMPLE_DATA = `vmess://ewogICJ2IjogIjIiLAogICJwcyI6ICJleGFtcGxlLXZtZXNzIiwKICAiYWRkIjogIjE5Mi4xNjguMS4xIiwKICAicG9ydCI6ICI0NDMiLAogICJpZCI6ICIxMzgwNmFkYi0yMzY4LTRhY2YtYjgwNS00NWI5ZWMyNTI1ZDMiLAogICJhaWQiOiAiMCIsCiAgInNjeSI6ICJhdXRvIiwKICAibmV0IjogIndzIiwKICAidHlwZSI6ICJub25lIiwKICAiaG9zdCI6ICJleGFtcGxlLmNvbSIsCiAgInBhdGgiOiAiL3JheSIsCiAgInRscyI6ICJ0bHMiLAogICJzbmkiOiAiZXhhbXBsZS5jb20iCn0=
vless://13806adb-2368-4acf-b805-45b9ec2525d3@192.168.1.2:443?type=ws&security=tls&path=%2Fray&host=sub.example.com&sni=sub.example.com#example-vless
trojan://password@192.168.1.3:443?sni=another.example.com#example-trojan
vmess://ewogICJwcyI6ICJpbnZhbGlkLWNvbmZpZyIKfQ==`;

function App(): React.ReactNode {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ConversionResult[]>([]);

  const handleConvert = useCallback(() => {
    if (!inputText.trim()) {
      setError('Input cannot be empty.');
      setOutputText('');
      setResults([]);
      return;
    }
    setIsLoading(true);
    setError('');
    setOutputText('');
    setResults([]);

    setTimeout(() => {
      try {
        const { yamlOutput, results: conversionResults } = processInput(inputText);
        const successfulConversions = conversionResults.filter(r => r.success).length;
        
        if (successfulConversions === 0 && conversionResults.length > 0) {
            setOutputText('');
            setError('No valid configurations found. Check the log for details.');
        } else if (conversionResults.length === 0) {
             setOutputText('');
             setError('Input cannot be empty.');
        } else {
            setOutputText(yamlOutput);
            setError('');
        }
        setResults(conversionResults);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred during conversion.');
        setOutputText('');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // Simulate network delay for better UX
  }, [inputText]);

  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
    setError('');
    setResults([]);
  }, []);
  
  const handleLoadSample = useCallback(() => {
    setInputText(SAMPLE_DATA);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-300">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-start">
          <InputPanel
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onConvert={handleConvert}
            onClear={handleClear}
            onLoadSample={handleLoadSample}
            isLoading={isLoading}
          />
          <OutputPanel
            yamlOutput={outputText}
            error={error}
            results={results}
            isLoading={isLoading}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
