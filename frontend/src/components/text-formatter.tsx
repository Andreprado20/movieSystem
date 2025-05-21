"use client"

import { useEffect, useState } from "react"

interface TextFormatterProps {
  content: string
}

export function TextFormatter({ content }: TextFormatterProps) {
  const [formattedContent, setFormattedContent] = useState("")

  useEffect(() => {
    // Basic formatting: Convert markdown-like syntax to HTML
    let formatted = content
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic text
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Headers
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      // Lists
      .replace(/^\s*- (.*$)/gm, "<li>$1</li>")
      // Links
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-blue-400 hover:underline">$1</a>')
      // Line breaks
      .replace(/\n/g, "<br />")

    // Wrap lists in <ul> tags
    if (formatted.includes("<li>")) {
      formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    }

    setFormattedContent(formatted)
  }, [content])

  return <div dangerouslySetInnerHTML={{ __html: formattedContent }} className="prose prose-invert max-w-none" />
}
