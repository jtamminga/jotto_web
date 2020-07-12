import React, { Component } from 'react'
import CharInput from './char-input'

class Guess extends Component {

  onWordChange = (word) => {
    this.commonInput.focus()
    this.props.onWordChange(word)
  }

  // <input
  //   autoFocus
  //   type="text"
  //   className="word"
  //   defaultValue={this.props.word}
  //   onChange={this.onWordChange} />

  render() {
    return (
      <div className="guess">


        <CharInput
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
