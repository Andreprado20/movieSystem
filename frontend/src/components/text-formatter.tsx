"use client"

interface TextFormatterProps {
  content: string
}

export function TextFormatter({ content }: TextFormatterProps) {
  // Function to convert the text to HTML with basic formatting
  const formatText = (text: string) => {
    // Replace line breaks with <br> tags
    let formattedText = text.replace(/\n/g, "<br />")

    // Bold text (** or __)
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    formattedText = formattedText.replace(/__(.*?)__/g, "<strong>$1</strong>")

    // Italic text (* or _)
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>")
    formattedText = formattedText.replace(/_(.*?)_/g, "<em>$1</em>")

    // Bullet points
    formattedText = formattedText.replace(/• (.*?)(<br \/>|$)/g, "<li>$1</li>")
    formattedText = formattedText.replace(/- (.*?)(<br \/>|$)/g, "<li>$1</li>")

    // Wrap lists in <ul> tags
    if (formattedText.includes("<li>")) {
      formattedText = formattedText.replace(/<li>(.*?)<\/li>/g, "<ul><li>$1</li></ul>")
      // Combine adjacent lists
      formattedText = formattedText.replace(/<\/ul><ul>/g, "")
    }

    return formattedText
  }

  return <div className="text-formatter" dangerouslySetInnerHTML={{ __html: formatText(content) }} />
}
