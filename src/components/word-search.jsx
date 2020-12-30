import React, { PureComponent } from 'react'
import WordList from './word-list'
import { wordSearch, sample, arrayEqual } from '../core/utils'

class WordSearch extends PureComponent {
    state = {
        showSearch: false,
        contains: '',
        notContains: ''
    }

    // for performance reasons
    searchCache = {
        words: [],
        contains: '',
        notContains: '',
        filtered: []
    }

    sampleCache = {
        filtered: [],
        sampled: []
    }

    onContainsInput = (e) => {
        this.setState({ contains: e.target.value.toLowerCase() })
    }

    onNotContainsInput = (e) => {
        this.setState({ notContains: e.target.value.toLowerCase() })
    }

    onSearch = () => {
        this.setState({ showSearch: !this.state.showSearch })
    }

    onClear = () => {
        this.setState({ contains: '', notContains: '' })
    }

    search(words, contains, notContains) {
        if (this.searchCache.contains === contains
                && this.searchCache.notContains === notContains
                && arrayEqual(this.searchCache.words, words)) {
            return this.searchCache.filtered
        }

        this.searchCache.words = words
        this.searchCache.contains = contains
        this.searchCache.notContains = notContains
        this.searchCache.filtered = wordSearch(words, contains, notContains)
        return this.searchCache.filtered
    }

    sample(filtered) {
        if (arrayEqual(this.sampleCache.filtered, filtered)) {
            return this.sampleCache.sampled
        }

        this.sampleCache.filtered = filtered
        this.sampleCache.sampled = sample(filtered, 20)
        return this.sampleCache.sampled
    }

    render() {
        const { words, onClick } = this.props
        const { showSearch, contains, notContains } = this.state

        const filtered = showSearch ?
            this.search(words, contains, notContains) : words

        // get some random words to show
        const sampled = this.sample(filtered)

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