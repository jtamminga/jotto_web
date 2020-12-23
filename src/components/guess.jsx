import React, { PureComponent } from 'react'
import CharInput from './char-input'
import { wordValid } from '../core/utils'

class Guess extends PureComponent {

  constructor(props) {
    super(props)
    this.commonInput = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.word !== this.props.word && wordValid(this.props.word)) {
      this.commonInput.current.focus()
    }
  }

  onWordChange = (word) => {
    this.commonInput.current.focus()
    this.props.onWordChange(word)
  }

  onCommonChange = (e) => {
    let common = parseInt(e.target.value)
    if (this.isCommonValid(common)) {
      this.props.onCommonChange(common)
    }
  }

  isCommonValid(value) {
    return value >= 0 && value <= 5
  }

  render() {
    return (
      <div className="guess">

        <CharInput
          className="word"
          word={this.props.word}
          onWordChange={this.onWordChange} />

        <input
          type="number"
          className="common"
          defaultValue={this.props.isNew ? '' : this.props.common}
          onChange={this.onCommonChange}
          ref={this.commonInput}
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
