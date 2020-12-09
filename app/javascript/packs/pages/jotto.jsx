import React, { Component } from 'react'
import { DeductionContext } from '../core/deduction-context'
import Guess from '../components/guess'
import WordSummary from '../components/word-summary'
import Alphabet from '../components/alphabet'
import Words from '../core/words'
import analyzer from '../core/analyzer'

window.id = 1;

class JottoHelper extends Component {
  state = {
    loading: false,
    guesses: [this.addGuess()],

    search: [],
    words: [],
    found: [],
    eliminated: []
  }

  onGuessRemove = (id) => {
    let guesses = this.state.guesses.filter(g => id != g.id)
    this.setState({ guesses }, this.getData)
  }

  onWordChange = (id, word) => {
    this.updateGuess(id, { word })
  }

  onCommonChange = (id, common) => {
    this.updateGuess(id, { common })
  }

  onWordClick = (word) => {
    let a = this.state.guesses.slice(0, -1)
    let b = this.state.guesses.slice(-1)[0]
    let guesses = [ ...a, { ...b, word } ]

    this.setState({ guesses })
  }

  onFindWordsClick = () => {
    // open up the find words thing
  }

  addGuess() {
    return { id: window.id++, word: '', common: null, isNew: true }
  }

  updateGuess(id, guess) {
    let guesses = this.state.guesses.map(g => {
      if (g.id != id) return g

      let updated = { ...g, ...guess }
      return { ...updated, isNew: !this.validGuess(updated) }
    })

    if (guesses.every(g => this.validGuess(g))) {
      guesses.push(this.addGuess())
    }

    this.setState({ guesses }, this.getData)
  }

  validGuess(guess) {
    return guess.word.length == 5
      && guess.common !== null
      && guess.common >= 0
      && guess.common <= 5
  }

  validGuesses() {
    return this.state.guesses
      .filter(g => !g.isNew && this.validGuess(g))
      .map(g => ({ word: g.word, common: g.common }))
  }

  guessesMatch(preGuesses, curGuesses) {
    if (preGuesses.length != curGuesses.length) return false

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

    if (guesses.length == 0) {
      this.setState({ words: [], found: [], eliminated: [] })
      return
    }

    if (this.guessesMatch(this.state.search, guesses)) {
      // just return if guesses didn't change
      return
    }

    let words = Words.withGuesses(guesses)
    let { found, eliminated } = analyzer(words)

    console.groupCollapsed('analyst info')
    console.log('num words', words.length)
    console.log('found', found)
    console.log('eliminated', eliminated)
    console.groupEnd()

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
        onWordChange={this.onWordChange.bind(this, guess.id)}
        onCommonChange={this.onCommonChange.bind(this, guess.id)}
        onRemove={this.onGuessRemove.bind(this, guess.id)}
        {...guess} />
    )
  }

  render() {
    const { guesses, found, eliminated } = this.state

    return (
      <>
        <div className="header">
          <h3>Jotto Helper</h3>
          <a onClick={this.onFindWordsClick}>Find Words</a>
        </div>

        <DeductionContext.Provider value={{ found, eliminated }}>
          <Alphabet />

          <div className="guesses-container">
            <div className="guesses">
              {this.renderGuesses(guesses)}
            </div>
          </div>

          <WordSummary words={this.state.words} onClick={this.onWordClick} />
        </DeductionContext.Provider>
      </>
    )
  }
}

export default JottoHelper
