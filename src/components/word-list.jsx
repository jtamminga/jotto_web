import React from 'react'
import { arrayEqual } from '../core/utils'
import Word from './word'

export default React.memo(function WordList({ words, onClick }) {
    return (
        <div className="words">
        { words.map((word, i) =>
            <Word key={i} value={word} onClick={onClick && onClick.bind(this, word)} />
        )}
        </div>
    )
}, (pre, next) => arrayEqual(pre.words, next.words))