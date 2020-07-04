import React from 'react'

function words({ words }) {
  return (
    <div>
      <p>{words.length} words!</p>
      { words.length < 30 &&
        <ul>
          { words.map(word =>
            <li>{word}</li>
          )}
        </ul>
      }
    </div>
  )
}

export default words
