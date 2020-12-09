import React from 'react'
import Word from './word'

export default function WordList({ words, onClick }) {
    return words.map((word, i) =>
        <Word key={i} value={word} onClick={onClick && onClick.bind(this, word)} />)
}