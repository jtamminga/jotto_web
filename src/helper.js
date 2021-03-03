import React, { Component } from 'react'
import { DeductionContext } from './core/context'
import Guess from './components/guess'
import Alphabet from './components/alphabet'
import Words from './core/words'
import analyzer from './core/analyzer'
import WordSearch from './components/word-search'
import { duplicates, hasError } from './core/utils'
import './styles/app.scss'

class Helper extends Component {
  constructor(props) {
    super(props)

    this.id = 0

    this.state = {
      loading: false,
      guesses: [this.addGuess()],
  
      words: Words.all,
      search: [],
      found: [],
      eliminated: []
    }
  }

  // need to clean this up
  // why is getdata called after setting state
  //   - probably not needed any more, now that not async
  // onWordClick not dry

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

    if (guesses.every(g => !hasError(g))) {
      guesses.push(this.addGuess())
    }

    this.setState({ guesses })
  }

  addGuess() {
    return {
      id: this.id++,
      word: '',
      common: '', // empty string because can't have null

      invalidChar: false,
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
      return { ...updated, ...errors }
    })

    if (guesses.every(g => !hasError(g))) {
      guesses.push(this.addGuess())
    }

    this.setState({ guesses }, this.getData)
  }

  validGuess({ word, common }) {
    return {
      invalidChar: !/^[a-z]*$/.test(word),
      wordShort: word.length !== 5,
      doubleLetter: duplicates(word).length > 0,
      badNumber: common === '' || common < 0 || common > 5
    }
  }

  validGuesses() {
    return this.state.guesses
      .filter(g => !hasError(g))
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

    this.setState({
      search: guesses,
      words,
      found,
      eliminated
    })
  }

  renderGuesses(guesses) {
    return guesses.map((guess, i) =>
      <Guess
        key={guess.id}
        onGuessChange={this.updateGuess.bind(this, guess.id)}
        onRemove={this.onGuessRemove.bind(this, guess.id)}
        isNew={i === guesses.length - 1}
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

export default Helper