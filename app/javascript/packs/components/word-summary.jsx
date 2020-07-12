import React from 'react'
import Word from './word'
import { sample } from '../utils'

export default function WordSummary({ words, onClick }) {
  return (
    <div className="word-summary">
      <p>{words.length} words!</p>
      <p>
        <h5>Random words left</h5>
        <div className="words">
          <WordList words={sample(words, 20)} onClick={onClick} />
        </div>
      </p>
      <a href="#">Show more</a>
    </div>
  )
}

export function WordList({ words, onClick }) {
  return words.map((word, i) =>
    <Word key={i} value={word} onClick={onClick && onClick.bind(this, word)} />)
}
