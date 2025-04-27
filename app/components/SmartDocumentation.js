'use client';

import { useState } from 'react';
import { DocumentTextIcon, ArrowPathIcon, ClipboardIcon, ExclamationTriangleIcon, InformationCircleIcon, CodeBracketIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

// Custom renderer for code blocks to detect method tags
const MethodTag = ({ children }) => {
  const text = String(children);
  
  // If this is a method tag (GET, POST, etc.)
  if (/^(GET|POST|PUT|DELETE|PATCH)$/.test(text)) {
    const methodColors = {
      GET: 'bg-blue-500/20 text-blue-400',
      POST: 'bg-green-500/20 text-green-400',
      PUT: 'bg-amber-500/20 text-amber-400',
      DELETE: 'bg-red-500/20 text-red-400',
      PATCH: 'bg-purple-500/20 text-purple-400'
    };
    
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${methodColors[text] || 'bg-gray-500/20 text-gray-400'}`}>
        {text}
      </span>
    );
  }
  
  // Regular code
  return <code>{children}</code>;
};

// Custom renderer for code blocks
const CodeBlock = ({ className, children }) => {
  // Extract language from className (if provided by markdown)
  const language = className ? className.replace('language-', '') : 'json';
  const displayLanguage = {
    json: 'JSON',
    javascript: 'JavaScript',
    js: 'JavaScript',
    bash: 'Shell',
    shell: 'Shell',
    sh: 'Shell',
    http: 'HTTP',
    yaml: 'YAML',
    yml: 'YAML',
  }[language] || language;
  
  return (
    <div className="mt-3 mb-4 not-prose">
      <div className="flex items-center justify-between bg-black/50 border border-white/10 border-b-0 rounded-t-md px-4 py-1.5">
        <div className="flex items-center gap-1.5">
          <CodeBracketIcon className="w-3.5 h-3.5 text-white/50" />
          <span className="text-xs font-light text-white/70">{displayLanguage}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
        </div>
      </div>
      <div className="bg-black/40 border border-white/10 px-4 py-3 overflow-x-auto rounded-b-md">
        <pre className="text-xs font-mono text-white/80 whitespace-pre">
          {children}
        </pre>
      </div>
    </div>
  );
};

// Custom renderer for paragraphs
const Paragraph = ({ children }) => {
  return <p className="text-white/80 leading-relaxed my-3">{children}</p>;
};

// Custom renderer for headings
const Heading = ({ level, children }) => {
  if (level === 1) {
    return (
      <h1 className="text-xl font-light text-white/90 border-b border-white/10 pb-2 mb-6 mt-2 tracking-wide">
        {children}
      </h1>
    );
  }
  
  if (level === 2) {
    return (
      <h2 className="text-lg font-light text-white/90 mt-8 mb-4 flex items-center gap-1.5 tracking-wide">
        <span className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-indigo-400/50 rounded-full"></span>
        {children}
      </h2>
    );
  }
  
  if (level === 3) {
    return (
      <h3 className="text-base font-medium text-white/90 mt-6 mb-3 tracking-wide">
        {children}
      </h3>
    );
  }
  
  if (level === 4) {
    return (
      <h4 className="text-sm font-medium text-indigo-300/90 mt-4 mb-2">
        {children}
      </h4>
    );
  }
  
  return <h5 className="text-xs font-semibold text-white/70 uppercase tracking-wide mt-4 mb-2">{children}</h5>;
};

// Custom renderer for lists
const List = ({ ordered, children }) => {
  return ordered ? (
    <ol className="my-4 pl-6 space-y-2 list-decimal marker:text-indigo-400/70">{children}</ol>
  ) : (
    <ul className="my-4 pl-6 space-y-2 list-disc marker:text-indigo-400/70">{children}</ul>
  );
};

// Custom renderer for list items
const ListItem = ({ children }) => {
  return <li className="text-white/80 pl-1">{children}</li>;
};

// Custom renderer for links
const Link = ({ href, children }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 border-b border-indigo-500/20 hover:border-indigo-500/40"
    >
      {children}
    </a>
  );
};

// Custom renderer for blockquotes
const Blockquote = ({ children }) => {
  return (
    <blockquote className="pl-4 border-l-2 border-indigo-500/30 italic text-white/60 my-4">
      {children}
    </blockquote>
  );
};

// Custom renderer for horizontal rules
const ThematicBreak = () => {
  return <hr className="my-6 border-t border-white/10" />;
};

export default function SmartDocumentation({ webhookId }) {
  const [documentation, setDocumentation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [usingSampleData, setUsingSampleData] = useState(false);

  const generateDocumentation = async () => {
    if (!webhookId) {
      setError('No webhook ID available. Please generate a webhook URL first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setUsingSampleData(false);
    
    try {
      const response = await fetch('/api/generate-documentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ webhookId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate documentation');
      }
      
      setDocumentation(data.documentation);
      setUsingSampleData(data.sampleData || false);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to generate documentation');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (documentation) {
      try {
        await navigator.clipboard.writeText(documentation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Could not copy text:', error);
      }
    }
  };
  
  const downloadMarkdown = () => {
    if (!documentation) return;
    
    // Create a blob with the markdown content
    const blob = new Blob([documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `webhook-api-documentation-${webhookId}.md`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  
  // Helper to render error message with appropriate styling
  const renderErrorMessage = (errorMsg) => {
    const isApiKeyError = errorMsg.toLowerCase().includes('api key') || 
                         errorMsg.toLowerCase().includes('openai');
    
    const isNoRequestsError = errorMsg.toLowerCase().includes('no requests found');
    
    return (
      <div className={`text-xs p-3 rounded flex items-start gap-2 ${
        isApiKeyError 
          ? 'bg-amber-500/10 text-amber-400' 
          : 'bg-red-500/10 text-red-400'
      }`}>
        <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">{
            isApiKeyError 
              ? 'OpenAI API Key Issue' 
              : isNoRequestsError 
                ? 'No Webhook Requests Found' 
                : 'Error'
          }</p>
          <p className="mt-1">{errorMsg}</p>
          {isApiKeyError && (
            <p className="mt-2">
              Please add a valid OpenAI API key to your .env file:
              <code className="block mt-1 bg-black/40 p-1.5 rounded font-mono">
                OPENAI_API_KEY=your_api_key_here
              </code>
            </p>
          )}
          {isNoRequestsError && (
            <p className="mt-2">
              Try sending some requests to your webhook URL using the Webhook Simulator above,
              or by making API calls to the webhook endpoint directly.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/5 p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-light text-white/80 flex items-center gap-1.5">
          <DocumentTextIcon className="w-4 h-4 text-white/50" />
          <span>API Documentation</span>
        </h2>
        
        {documentation && (
          <div className="flex space-x-3">
            <button
              onClick={downloadMarkdown}
              className="text-xs text-indigo-300/70 hover:text-indigo-300 transition-colors flex items-center"
              title="Download as Markdown"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5 mr-1.5" />
              <span>Download</span>
            </button>
            
            <button
              onClick={copyToClipboard}
              className="text-xs text-indigo-300/70 hover:text-indigo-300 transition-colors flex items-center"
              title="Copy to Clipboard"
            >
              <ClipboardIcon className="w-3.5 h-3.5 mr-1.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>
      
      {!documentation ? (
        <div className="space-y-3">
          <p className="text-xs text-white/60">
            Auto-generate documentation for your webhook API based on received requests.
          </p>
          
          <button
            onClick={generateDocumentation}
            disabled={isGenerating || !webhookId}
            className={`w-full bg-indigo-600/80 hover:bg-indigo-600 text-white/90 hover:text-white text-xs px-4 py-2.5 rounded transition-colors flex items-center justify-center ${
              (!webhookId) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-3 h-3 rounded-full border border-white/80 border-t-transparent animate-spin mr-2"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <DocumentTextIcon className="w-3.5 h-3.5 mr-2 opacity-80" />
                <span>Generate Documentation</span>
              </>
            )}
          </button>
          
          {error && renderErrorMessage(error)}
        </div>
      ) : (
        <div className="space-y-3">
          {usingSampleData && (
            <div className="text-xs p-3 rounded flex items-start gap-2 bg-blue-500/10 text-blue-400 mb-3">
              <InformationCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Using Sample Data</p>
                <p className="mt-1">
                  This documentation was generated using automatically created sample requests.
                  For more accurate documentation, send real requests to your webhook URL.
                </p>
              </div>
            </div>
          )}
          <div className="doc-container relative backdrop-blur-sm bg-gradient-to-b from-black/40 to-black/20 rounded-md border border-white/10 shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/5 to-transparent rounded-t-md"></div>
            
            <div className="overflow-y-auto max-h-[500px] px-6 py-5">
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    code: MethodTag,
                    pre: CodeBlock,
                    p: Paragraph,
                    h1: ({ node, ...props }) => <Heading level={1} {...props} />,
                    h2: ({ node, ...props }) => <Heading level={2} {...props} />,
                    h3: ({ node, ...props }) => <Heading level={3} {...props} />,
                    h4: ({ node, ...props }) => <Heading level={4} {...props} />,
                    h5: ({ node, ...props }) => <Heading level={5} {...props} />,
                    h6: ({ node, ...props }) => <Heading level={6} {...props} />,
                    ul: List,
                    ol: ({ node, ordered, ...props }) => <List ordered={true} {...props} />,
                    li: ListItem,
                    a: Link,
                    blockquote: Blockquote,
                    hr: ThematicBreak
                  }}
                >{documentation}</ReactMarkdown>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent rounded-b-md pointer-events-none"></div>
          </div>
          
          <div className="flex justify-end mt-2">
            <button
              onClick={generateDocumentation}
              disabled={isGenerating}
              className="text-xs text-indigo-300/70 hover:text-indigo-300 transition-colors flex items-center"
            >
              <ArrowPathIcon className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 