import React, { PureComponent } from 'react'
import CharInput from './char-input'

class Guess extends PureComponent {

  onWordChange = (word) => {
    this.commonInput.focus()
    this.props.onWordChange(word)
  }

  render() {
    return (
      <div className="guess">

        <CharInput
          key={this.props.word}
          className="word"
          word={this.props.word}
          onWord={this.onWordChange} />

        <input
          type="number"
          className="common"
          defaultValue={this.props.isNew ? '' : this.props.common}
          onChange={this.props.onCommonChange}
          ref={input => this.commonInput = input}
          min="0"
          max="5" />

        { !this.props.isNew &&
          <div className="remove" onClick={this.props.onRemove}></div>
        }
      </div>
    )
  }
}

export default Guess
