import React, { Component } from 'react'

class Input extends Component {
  state = { chars: '' }

  onKeyPress = (e) => {
    this.props.onChange(e.target.value)

    this.setState({
      chars: e.target.value
    })
  }

  render() {
    return (
      <input onChange={this.onKeyPress} value={this.state.chars} />
    )
  }
}

export default Input
