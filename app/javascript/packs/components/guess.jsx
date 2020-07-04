import React, { Component } from 'react'

class Guess extends Component {

  onWordChange = (e) => {
    if (e.target.value.length == 5) {
      this.commonInput.focus()
      this.commonInput.select()
      this.props.onWordChange(e)
    }
  }

  render() {
    return (
      <div className="guess">
        <input
          autoFocus
          type="text"
          className="word"
          defaultValue={this.props.word}
          onChange={this.onWordChange} />

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
