"use client"
import React from "react"

interface SimpleMarkdownRendererProps {
  content: string
}

export function SimpleMarkdownRenderer({ content }: SimpleMarkdownRendererProps) {
  // Basic markdown processing without a library
  const processedContent = React.useMemo(() => {
    // Replace markdown syntax with HTML
    const html = content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3 mt-5">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>')

      // Bold and italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')

      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-6 mb-1">$1</li>')
      .replace(/<\/li>\n<li/gim, "</li><li")
      .replace(/(<li.*<\/li>)/gim, '<ul class="list-disc mb-4">$1</ul>')

      // Paragraphs
      .replace(/^\s*(\n)?(.+)/gim, (m) => (/<(\/)?(h1|h2|h3|ul|ol|li)/i.test(m) ? m : '<p class="mb-4">' + m + "</p>"))

      // Line breaks
      .replace(/\n/gim, "<br>")

    return html
  }, [content])

  return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: processedContent }} />
}
