'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

interface CodeSnippetProps {
  code: string;
  className?: string;
}

/**
 * Component to safely render code snippets that may contain:
 * - Script tags (extracted and rendered via Next.js Script component)
 * - HTML content (rendered via dangerouslySetInnerHTML)
 * - Widget divs with data attributes
 */
export function CodeSnippet({ code, className = '' }: CodeSnippetProps) {
  const [scripts, setScripts] = useState<Array<{ src?: string; content?: string; id?: string }>>([]);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code || !code.trim()) {
      setScripts([]);
      setHtmlContent('');
      return;
    }

    // Extract script tags
    const scriptRegex = /<script\s+([^>]*)>([\s\S]*?)<\/script>/gi;
    const extractedScripts: Array<{ src?: string; content?: string; id?: string }> = [];
    let processedCode = code;

    let match;
    while ((match = scriptRegex.exec(code)) !== null) {
      const fullMatch = match[0];
      const attributes = match[1];
      const scriptContent = match[2];

      // Extract src attribute
      const srcMatch = attributes.match(/src=["']([^"']+)["']/i);
      const src = srcMatch ? srcMatch[1] : undefined;

      // Extract id attribute
      const idMatch = attributes.match(/id=["']([^"']+)["']/i);
      const id = idMatch ? idMatch[1] : undefined;

      if (src) {
        // External script
        extractedScripts.push({ src, id });
      } else if (scriptContent.trim()) {
        // Inline script
        extractedScripts.push({ content: scriptContent.trim(), id });
      }

      // Remove script tag from HTML content
      processedCode = processedCode.replace(fullMatch, '');
    }

    setScripts(extractedScripts);
    setHtmlContent(processedCode.trim());
  }, [code]);

  // Render inline scripts after component mounts
  useEffect(() => {
    if (containerRef.current && scripts.length > 0) {
      scripts.forEach((script) => {
        if (script.content && !script.src) {
          // Check if script already exists
          const existingScript = containerRef.current?.querySelector(
            script.id ? `script#${script.id}` : 'script[data-inline-script]'
          );
          
          if (!existingScript) {
            const scriptElement = document.createElement('script');
            if (script.id) scriptElement.id = script.id;
            scriptElement.setAttribute('data-inline-script', 'true');
            scriptElement.textContent = script.content;
            containerRef.current?.appendChild(scriptElement);
          }
        }
      });
    }
  }, [scripts, containerRef]);

  if (!code || !code.trim()) {
    return null;
  }

  return (
    <div className={className}>
      {/* Render HTML content (widget divs, etc.) */}
      {htmlContent && (
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}

      {/* Render external script tags using Next.js Script component */}
      {scripts.map((script, index) => {
        if (script.src) {
          return (
            <Script
              key={`script-${index}-${script.src}`}
              src={script.src}
              strategy="afterInteractive"
              id={script.id}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

