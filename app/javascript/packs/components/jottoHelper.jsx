import React, { Component } from 'react'
import Guess from './guess'
import Words from './words'
import { fetchGuesses } from '../api'

window.id = 0;

class JottoHelper extends Component {
  state = {
    loading: false,
    guesses: [this.addGuess()],
    words: [],
    found: [],
    eliminated: []
  }

  onGuessRemove = (id) => {
    let guesses = this.state.guesses.filter(g => id != g.id)
    this.setState({ guesses }, this.getData)
  }

  onWordChange = (id, e) => {
    this.updateGuess(id, { word: e.target.value })
  }

  onCommonChange = (id, e) => {
    this.updateGuess(id, { common: parseInt(e.target.value) })
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

  getData() {
    const guesses = this.validGuesses()

    if (guesses.length == 0) {
      this.setState({ words: [] })
      return
    }

    this.setState({ loading: true })

    fetchGuesses(guesses)
      .then(({ words }) => {
        this.setState({ loading: false, words })
      })
  }

  render() {
    let guesses = this.state.guesses.map((guess, i) =>
      <Guess
        key={guess.id}
        onWordChange={this.onWordChange.bind(this, guess.id)}
        onCommonChange={this.onCommonChange.bind(this, guess.id)}
        onRemove={this.onGuessRemove.bind(this, guess.id)}
        {...guess} />
    )

    return (
      <>
        <h3>Find words</h3>

        {guesses}

        <Words words={this.state.words} />
      </>
    )
  }
}

export default JottoHelper
