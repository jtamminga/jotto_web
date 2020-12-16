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

    onSearch = () => {
        this.setState({ showSearch: !this.state.showSearch })
    }

    onClear = () => {
        this.setState({ contains: '', notContains: '' })
    }

    render() {
        const { words, onClick } = this.props
        const { showSearch, contains, notContains } = this.state

        const filtered = showSearch ?
            wordSearch(words, contains, notContains) : words

        // get some random words to show
        const sampled = sample(filtered, 20)

        return (
            <div className="word-search">
                <div className="word-summary">
                    <WordSummary
                        numWords={words.length}
                        numFiltered={filtered.length}
                    />
                    <div>
                        { showSearch &&
                            <span
                                onClick={this.onClear}
                                className="btn-label"
                                style={{ marginRight: '0.5em' }}
                            >Clear</span>
                        }
                        <span
                            onClick={this.onSearch}
                            className="btn-label"
                        >Search</span>
                    </div>
                </div>
                { showSearch &&
                    <div className="word-filter">
                        <div>
                            <input
                                value={contains}
                                onChange={this.onContainsInput}
                            />
                            <span>Contains</span>
                        </div>
                        <div>
                            <input
                                value={notContains}
                                onChange={this.onNotContainsInput}
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
                {numFiltered} of {numWords} possible
            </span>
        )
    }

    return (
        <span>{numWords} possible</span>
    )
}

export default WordSearch