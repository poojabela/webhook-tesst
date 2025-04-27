'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, ClipboardIcon } from '@heroicons/react/24/outline';

export default function JsonViewer({ json }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const jsonString = JSON.stringify(json, null, 2);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  // Custom style for the syntax highlighter
  const customStyle = {
    backgroundColor: 'transparent',
    margin: 0,
    padding: '12px 14px',
    borderRadius: '4px',
    fontSize: '12px',
    lineHeight: '1.5',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  };

  // Customize the theme
  const customTheme = {
    ...tomorrow,
    'pre[class*="language-"]': {
      ...tomorrow['pre[class*="language-"]'],
      background: 'transparent',
    },
    'code[class*="language-"]': {
      ...tomorrow['code[class*="language-"]'],
      background: 'transparent',
    },
    'property': {
      ...tomorrow['property'],
      color: '#9D8DF1' // Subtle purple for properties
    },
    'string': {
      ...tomorrow['string'],
      color: '#5EEAD4' // Teal for strings
    },
    'number': {
      ...tomorrow['number'],
      color: '#F4B8E4' // Light pink for numbers
    },
    'boolean': {
      ...tomorrow['boolean'],
      color: '#CAA6FE' // Lavender for booleans
    }
  };
  
  if (isCollapsed) {
    return (
      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-md shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-2.5 bg-black/40 border-b border-white/10">
          <div className="text-xs text-white/60 font-medium">
            {Object.keys(json).length} {Object.keys(json).length === 1 ? 'item' : 'items'}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(false)}
              className="text-white/60 hover:text-white/90 transition-colors"
            >
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-md shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-2.5 bg-black/40 border-b border-white/10">
        <div className="text-xs text-white/60 font-medium">
          {Object.keys(json).length} {Object.keys(json).length === 1 ? 'item' : 'items'}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="text-white/60 hover:text-white/90 transition-colors"
            title={isCopied ? 'Copied!' : 'Copy to clipboard'}
          >
            {isCopied ? <CheckIcon className="w-4 h-4 text-emerald-400" /> : <ClipboardIcon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-white/60 hover:text-white/90 transition-colors"
          >
            <ChevronUpIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <SyntaxHighlighter
          language="json"
          style={customTheme}
          customStyle={customStyle}
          wrapLongLines={false}
        >
          {jsonString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
} 