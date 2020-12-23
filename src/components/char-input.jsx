import React, { Component } from 'react'
import { DeductionContext } from '../core/deduction-context'
import { wordValid, charClasses } from '../core/utils'

class CharInput extends Component {
  state = {
    isFocused: true
  }

  componentDidUpdate(prevProps) {
    if (this.state.isFocused
        && prevProps.word !== this.props.word
        && wordValid(this.props.word)) {
      this.setState({ isFocused: false })
    }
  }

  onChange = (e) => {
    let word = e.target.value.toLowerCase()
    let chars = this.toChars(word)
    let isValid = wordValid(chars)

    this.setState({ isFocused: !isValid })

    if (isValid) this.props.onWordChange(word)
  }

  onClick = (e) => {
    this.setState({ isFocused: true })
  }

  onBlur = (e) => {
    if (wordValid(this.props.word)) {
      this.setState({ isFocused: false })
    }
  }

  toChars(word) {
    return word.split('')
  }

  render() {
    const { word, onWordChange, ...props } = this.props
    const { found, eliminated } = this.context

    return (
      <>
        { this.state.isFocused ?
          <input
            autoFocus
            defaultValue={word}
            onChange={this.onChange}
            onBlur={this.onBlur}
            { ...props }/>

            :

            <div className="word input-chars" onClick={this.onClick}>
              { this.toChars(word).map((char, i) =>
                <span key={i} className={charClasses(char, found, eliminated)}>
                  {char}
                </span>
              )}
            </div>
        }
      </>
    )
  }

}

CharInput.contextType = DeductionContext

export default CharInput
