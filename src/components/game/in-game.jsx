import React, { Component } from 'react'
import socket from '../../socket'
import Guess from './guess'
import { duplicates, hasError } from '../../core/utils'

class InGame extends Component {
  constructor(props) {
    super(props)
    this.id = 0;
    this.guessId = 0;

    this.state = {
      currentTurn: props.startPlayer,
      guesses: [this.addGuess()]
    }
  }

  isMyTurn() {
    return this.state.currentTurn === socket.userId
  }

  componentDidMount() {
    console.log('ingame mounted')
    socket.on('turn', ({ guess, common, nextPlayer, gameOver }) => {
      if (this.isMyTurn()) {
        this.updateGuess(this.guessId,   { common })
      }

      this.setState({ currentTurn: nextPlayer })
    })
  }

  componentWillUnmount() {
    socket.off('turn')
  }

  addGuess() {
    console.log('id', this.id)

    return {
      id: this.id++,
      word: '',
      common: '',

      submitted: false,

      invalidChar: false,
      wordShort: true,
      doubleLetter: false
    }
  }

  validGuess({ word }) {
    return {
      invalidChar: !/^[a-z]*$/.test(word),
      wordShort: word.length !== 5,
      doubleLetter: duplicates(word).length > 0
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
      socket.emit('submit_guess', guess.word)
      this.guessId = id
      guesses.push(this.addGuess())
    }

    this.setState({ guesses })
  }

  renderGuesses(guesses) {
    return guesses.map((guess, i) =>
      <Guess
        key={i}
        onChange={this.updateGuess.bind(this, guess.id)}
        isNew={i === guesses.length - 1}
        {...guess}
      />
    )
  }

  render() {
    const { word } = this.props 
    const { guesses } = this.state

    return (
      <>
        <div className="header">
          <h3>Five Letters</h3>
        </div>

        <div>My word: {word}</div>
        <div>My turn: {this.isMyTurn() ? 'yes' : 'no'}</div>

        <div className="guesses-container">
          <div className="guesses">
            {this.renderGuesses(guesses)}
          </div>
        </div>
      </>
    )
  }
}

export default InGame

