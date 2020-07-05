import React from 'react'
import { sample } from '../utils'

export default function words({ words, onClick }) {
  return (
    <div className="words">
      <p>{words.length} words!</p>
      <p>
        <WordList words={sample(words, 20)} />
      </p>
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

function WordList({ words }) {
  return words.map(word => <span>{word}</span>)
}
