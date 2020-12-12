import React, { Component } from 'react'
import WordList from './word-list'
import { wordSearch, sample } from '../core/utils'

class WordSearch extends Component {
    state = {
        showSearch: false,
        contains: '',
        notContains: ''
    }

    onContainsInput = (e) => {
        this.setState({ contains: e.target.value })
    }

    onNotContainsInput = (e) => {
        this.setState({ notContains: e.target.value })
    }

    onClick = () => {
        this.setState({ showSearch: !this.state.showSearch })
    }

    render() {
        const { words, onClick } = this.props
        const { showSearch, contains, notContains } = this.state

        const filtered = showSearch ?
            wordSearch(words, contains, notContains) : words

        const sampled = sample(filtered, 20)

        return (
            <div className="word-search">
                <div className="word-summary">
                    <WordSummary
                        numWords={words.length}
                        numFiltered={filtered.length}
                    />
                    <span onClick={this.onClick}>Search</span>
                </div>
                { this.state.showSearch &&
                    <div className="word-filter">
                        <div>
                            <input
                                defaultValue={contains}
                                onInput={this.onContainsInput}
                            />
                            <span>Contains</span>
                        </div>
                        <div>
                            <input
                                defaultValue={notContains}
                                onInput={this.onNotContainsInput}
                            />
                            <span>Not Contains</span>
                        </div>
                    </div>
                }

                <WordList words={sampled} onClick={onClick} />
            </div>
        )
    }
}

export function WordSummary({ numWords, numFiltered }) {
    const isFiltered = numWords !== numFiltered
    
    numWords = numWords.toLocaleString()
    numFiltered = numFiltered.toLocaleString()

    if (isFiltered) {
        return (
            <span>
                <span>{numFiltered}</span>
                <span> of </span>
                <span>{numWords}</span> possible
            </span>
        )
    }

    return (
        <span>
            <span>{numWords}</span> possible
        </span>
    )
}

export default WordSearch