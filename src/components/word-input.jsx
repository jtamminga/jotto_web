import React, { PureComponent } from 'react'
import { DeductionContext } from '../core/deduction-context'
import { wordValid, charClasses } from '../core/utils'

class WordInput extends PureComponent {

  onChange = (e) => {
    const word = e.target.value.toLowerCase()
    this.props.onWordChange(word)
  }

  toChars(word) {
    return word.split('')
  }

  render() {
    const {
      word,
      onFocus,
      onBlur,
      hasError,
      isFocused,
      isFaded,
      onWordChange, // just to filter out of props
      ...props
    } = this.props

    const { found, eliminated } = this.context

    // error feedback
    const inputClasses = ['word']
    if (hasError) inputClasses.push('has-error')
    
    // guess error feedback
    const wordClasses = ['word', 'input-chars']
    if (isFaded) wordClasses.push('faded')
    
    
    return (
      <>
        { word === '' || hasError || isFocused ?
          <input
            autoFocus
            value={word}
            onChange={this.onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            className={inputClasses.join(' ')}
            maxLength={5}
            spellCheck={false}
            { ...props }
          />

          :

          <div className={wordClasses.join(' ')} onClick={onFocus}>
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

WordInput.contextType = DeductionContext

export default WordInput
