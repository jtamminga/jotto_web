import React, { Component } from 'react'
import { DeductionContext } from './core/deduction-context'
import Guess from './components/guess'
import Alphabet from './components/alphabet'
import Words from './core/words'
import analyzer from './core/analyzer'
import WordSearch from './components/word-search'
import { duplicates, hasError } from './core/utils'
import './styles/app.scss'

window.id = 1;

class JottoHelper extends Component {
  state = {
    loading: false,
    guesses: [this.addGuess()],

    words: Words.all,
    search: [],
    found: [],
    eliminated: []
  }

  onGuessRemove = (id) => {
    let guesses = this.state.guesses.filter(g => id !== g.id)
    this.setState({ guesses }, this.getData)
  }

  onWordClick = (word) => {
    let a = this.state.guesses.slice(0, -1)
    let b = this.state.guesses.slice(-1)[0]
    const updated = { ...b, word }
    const errors = this.validGuess(updated)
    let guesses = [ ...a, { ...updated, ...errors } ]

    this.setState({ guesses })
  }

  addGuess() {
    return {
      id: window.id++,
      word: '',
      common: '', // empty string because can't have null
      isNew: true,

      wordShort: true,
      doubleLetter: false,
      badNumber: true
    }
  }

  updateGuess(id, guess) {
    const guesses = this.state.guesses.map(g => {
      if (g.id !== id) return g

      const updated = { ...g, ...guess }
      const errors = this.validGuess(updated)
      return { ...updated, ...errors, isNew: hasError(errors) }
    })

    if (guesses.every(g => !g.isNew && !hasError(g))) {
      guesses.push(this.addGuess())
    }

    this.setState({ guesses }, this.getData)
  }

  validGuess({ word, common }) {
    return {
      wordShort: word.length !== 5,
      doubleLetter: duplicates(word).length > 0,
      badNumber: common === '' || common < 0 || common > 5
    }
  }

  validGuesses() {
    return this.state.guesses
      .filter(g => !g.isNew && !hasError(g))
      .map(g => ({ word: g.word, common: g.common }))
  }

  guessesMatch(preGuesses, curGuesses) {
    if (preGuesses.length !== curGuesses.length) return false

    let result = true
    for (let i = 0; i < preGuesses.length; i++) {
      result = result
        && preGuesses[i].word === curGuesses[i].word
        && preGuesses[i].common === curGuesses[i].common
    }
    return result
  }

  getData() {
    const guesses = this.validGuesses()

    if (guesses.length === 0) {
      this.setState({ words: Words.all, found: [], eliminated: [] })
      return
    }

    if (this.guessesMatch(this.state.search, guesses)) {
      // just return if guesses didn't change
      return
    }

    let words = Words.withGuesses(guesses)
    let { found, eliminated } = analyzer(words)

    // console.groupCollapsed('analyst info')
    // console.log('num words', words.length)
    // console.log('found', found)
    // console.log('eliminated', eliminated)
    // console.groupEnd()

    this.setState({
      search: guesses,
      words,
      found,
      eliminated
    })
  }

  renderGuesses(guesses) {
    return guesses.map(guess =>
      <Guess
        key={guess.id}
        onGuessChange={this.updateGuess.bind(this, guess.id)}
        onRemove={this.onGuessRemove.bind(this, guess.id)}
        {...guess} />
    )
  }

  render() {
    const { guesses, found, eliminated } = this.state

    return (
      <>
        <div className="header">
          <h3>Five Letter Helper</h3>
        </div>

        <DeductionContext.Provider value={{ found, eliminated }}>
          <Alphabet />

          <div className="guesses-container">
            <div className="guesses">
              {this.renderGuesses(guesses)}
            </div>
          </div>

          <WordSearch words={this.state.words} onClick={this.onWordClick} />
        </DeductionContext.Provider>
      </>
    )
  }
}

export default JottoHelper