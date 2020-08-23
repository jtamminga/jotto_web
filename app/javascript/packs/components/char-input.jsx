import React, { Component } from 'react'
import { DeductionContext } from './deduction-context'

class CharInput extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()

    this.state = {
      isFocused: true,
      chars: (this.props.word.toLowerCase() || '').split()
    }
  }

  onChange = (e) => {
    let word = e.target.value.toLowerCase()
    let chars = word.split('')
    let isValid = this.isValid(chars)

    this.setState({ chars, isFocused: !isValid })

    if (isValid) this.props.onWord(word)
  }

  onClick = (e) => {
    this.setState({ isFocused: true })
  }

  onBlur = (e) => {
    if (this.isValid(this.state.chars)) {
      this.setState({ isFocused: false })
    }
  }

  duplicates(chars) {
    let hash = {}
    for (var char of chars) {
      hash[char] = hash[char] === undefined ? 1 : hash[char] + 1
    }

    let dups = []
    for (var char in hash) {
      if (hash[char] > 1) dups.push(char)
    }

    return dups
  }

  isValid(chars) {
    return chars.length == 5 && this.duplicates(chars).length == 0
  }

  charClasses(char) {
    const { found, eliminated } = this.context
    let classes = []
    if (found.includes(char)) classes.push('found')
    if (eliminated.includes(char)) classes.push('eliminated')
    return classes
  }

  render() {
    return (
      <>
        { !this.state.isFocused &&
          <div className="word input-chars" onClick={this.onClick}>
            { this.state.chars.map((char, i) =>
              <span key={i} className={this.charClasses(char)}>
                {char}
              </span>
            )}
          </div>
        }

        { this.state.isFocused &&
          <input
            autoFocus
            type="text"
            defaultValue={this.state.chars.join('')}
            onChange={this.onChange}
            onBlur={this.onBlur}
            ref={this.inputRef}
            { ...this.props }/>
        }
      </>
    )
  }

}

CharInput.contextType = DeductionContext

export default CharInput
