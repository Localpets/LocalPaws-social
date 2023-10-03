/* eslint-disable react/prop-types */
const FormatText = ({ text, messageId, expandedMessages, setExpandedMessages }) => {
  const handleReadMore = (messageId) => {
    setExpandedMessages((prevExpandedMessages) => ({
      ...prevExpandedMessages,
      [messageId]: true
    }))
  }

  const handleReadLess = (messageId) => {
    setExpandedMessages((prevExpandedMessages) => {
      const updatedExpandedMessages = { ...prevExpandedMessages }
      delete updatedExpandedMessages[messageId]
      return updatedExpandedMessages
    })
  }

  const formatMessageText = (text, messageId) => {
    const maxWordsPerLine = 10
    const maxVisibleLines = 4

    // Dividir el texto en líneas y luego en palabras
    const lines = text.split('\n')
    const words = lines.flatMap(line => line.split(' '))

    const formattedLines = []
    let currentLine = ''

    words.forEach((word, index) => {
      if (currentLine === '') {
        currentLine = word
      } else if (currentLine.split(' ').length < maxWordsPerLine) {
        currentLine += ' ' + word
      } else {
        formattedLines.push(currentLine)
        currentLine = word
      }
    })

    if (currentLine !== '') {
      formattedLines.push(currentLine)
    }

    const visibleLines = formattedLines.slice(0, maxVisibleLines)
    const remainingLines = formattedLines.slice(maxVisibleLines)

    const isExpanded = expandedMessages[messageId] === true

    return (
      <div>
        {visibleLines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        {remainingLines.length > 0 && (
          <>
            {isExpanded
              ? (
                <>
                  {remainingLines.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                  <button className='btn-ghost' onClick={() => handleReadLess(messageId)}>
                    Leer menos
                  </button>
                </>
                )
              : (
                <button className='btn-ghost' onClick={() => handleReadMore(messageId)}>
                  Leer más
                </button>
                )}
          </>
        )}
      </div>
    )
  }
  return (
    <div>{formatMessageText(text, messageId)}</div>
  )
}

export default FormatText
