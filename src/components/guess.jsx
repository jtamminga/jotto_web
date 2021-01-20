import React, { PureComponent } from 'react'
import WordInput from './word-input'
import CommonInput from './common-input'
import { hasError } from '../core/utils'

class Guess extends PureComponent {

  state = {
    isWordFocused: true,
    isCommonFocused: false,
    isCommonTouched: false
  }

  constructor(props) {
    super(props)
    this.commonInput = React.createRef()
  }

  componentDidUpdate(prevProps) {
    const { word, wordShort, doubleLetter, invalidChar } = this.props
    const isWordValid = !wordShort && !doubleLetter && !invalidChar

    if (prevProps.word !== word && isWordValid) {
      this.commonInput.current.focus()
    }
  }

  onWordChange = (word) => {
    this.props.onGuessChange({ word })
  }

  onWordFocus = () => {
    this.setState({ isWordFocused: true })
  }

  onWordBlur = () => {
    this.setState({ isWordFocused: false })
  }

  onCommonChange = (common) => {
    this.props.onGuessChange({ common })
  }

  onCommonFocus = () => {
    this.setState({ isCommonFocused: true, isCommonTouched: true })
  }

  onCommonBlur = () => {
    this.setState({ isCommonFocused: false })
  }

  wordErrors() {
    const { word, wordShort, doubleLetter, invalidChar } = this.props
    const { isWordFocused } = this.state
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

    if (wordShort && !isWordFocused)
      errors.push('Word must be a 5 letter word')

    return errors
  }

  commonErrors() {
    const { common, badNumber } = this.props
    // maybe just get rid of these states
    // const { isCommonTouched, isCommonFocused } = this.state
    const errors = []

    if (common === '')
      return []

    if (badNumber)
      errors.push('Number must be between 0 and 5')

    return errors
  }

  render() {
    const { word, common, isNew, onRemove } = this.props
    const { isWordFocused } = this.state

    const fadeWord = hasError(this.props)
    const wordErrors = this.wordErrors()
    const commonErrors = this.commonErrors()

    return (
      <div className="guess">
        <div className="guess-input">
          <WordInput
            word={word}
            onWordChange={this.onWordChange}
            onFocus={this.onWordFocus}
            onBlur={this.onWordBlur}
            isFocused={isWordFocused}
            isFaded={fadeWord}
            hasError={wordErrors.length > 0}
          />

          <CommonInput
            ref={this.commonInput}
            common={common}
            onCommonChange={this.onCommonChange}
            onFocus={this.onCommonFocus}
            onBlur={this.onCommonBlur}
            hasError={commonErrors.length > 0}
          />

          { !isNew &&
            <div className="remove" onClick={onRemove}></div>
          }
        </div>

        <div className="guess-errors">
          { [...wordErrors, ...commonErrors].map((error, i) =>
            <div key={i}>{error}</div>
          )}
        </div>
      </div>
    )
  }
}

export default Guess
