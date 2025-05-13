"use client"
import ReactMarkdown from "react-markdown"
import type React from "react"

interface MarkdownRendererProps {
  content: string
}

// Define a more specific type for the code component props
interface CodeProps {
  node: any
  inline?: boolean
  className?: string
  children: React.ReactNode
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className="prose prose-invert max-w-none"
      components={{
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
        p: ({ node, ...props }) => <p className="mb-4" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4" {...props} />
        ),
        // Use the proper type for the code component
        code: ({ node, inline, className, children, ...props }: CodeProps) => {
          return inline ? (
            <code className="bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          ) : (
            <code className="block bg-gray-700 p-3 rounded-md text-sm overflow-x-auto my-4" {...props}>
              {children}
            </code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
