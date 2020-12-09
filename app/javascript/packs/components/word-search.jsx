import React, { Compoenent } from 'react'
import WordList from './word-list'

class WordSearch extends Compoent {
    state = {
        showSearch: true,
        contains: '',
        notContains: ''
    }

    onInput = (e) => {
        
    } 

    render() {
        const { words, onClick } = this.props

        // let filtered = filter(words, contains, notContains)
        // then pass filtered to WordList

        return (
            <div>
                { this.state.showSearch &&
                    <input
                        onInput={this.onInput}
                    />
                }

                <WordList words={words} onClick={onClick} />
            </div>
        )
    }
}

export default WordSearch