import React, { PureComponent } from 'react'
import WordInput from '../word-input'

class Guess extends PureComponent {
  state = {
    isFocused: true
  }

  onChange = (word) => {
    this.props.onChange({ word })
  }

  onFocus = () => {
    this.setState({ isFocused: true })
  }

  onBlur = () => {
    this.setState({ isFocused: false })
  }

  errors() {
    const { word, wordShort, doubleLetter, invalidChar } = this.props
    const { isFocused } = this.state
    const errors = []

    if (word === '')
      return []

    if (invalidChar) {
      errors.push('Word can only contain letters')
      return errors
    }

    if (doubleLetter) {
      errors.push('Word cannot have a double letter')
      return errors
    }

    if (wordShort && !isFocused)
      errors.push('Word must be a 5 letter word')

    return errors
  }

  render() {
    const { word, common } = this.props
    const { isFocused } = this.state

    const errors = this.errors()

    return (
      <div className="guess">
        <div className="guess-input">
          <WordInput
            word={word}
            onWordChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            isFocused={isFocused}
            hasError={errors.length > 0}
          />

          <div className="guess-number">
            {common}
          </div>
        </div>

        <div className="guess-errors">
          { errors.map((error, i) =>
            <div key={i}>{error}</div>
          )}
        </div>
      </div>
    )
  }
}

export default Guess