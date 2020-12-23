import React from 'react'
import WordList from './word-list'
import { sample } from '../core/utils'

export default function WordSummary({ words, onClick }) {
  return (
    <div className="word-summary">
      <div>{words.length} possible words</div>
      <div>
        <h5>Sample possible words</h5>
        <WordList words={sample(words, 20)} onClick={onClick} />
      </div>
      <a href="#">Show more</a>
    </div>
  )
}
