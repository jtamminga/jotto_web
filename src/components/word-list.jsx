import React from 'react'
import Word from './word'

export default function WordList({ words, onClick }) {
    return (
        <div className="words">
        { words.map((word, i) =>
            <Word key={i} value={word} onClick={onClick && onClick.bind(this, word)} />
        )}
        </div>
    )
}