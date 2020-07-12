import React, { Component } from 'react'
import Input from './input.jsx'
import WordSummary from './word-summary.jsx'

class WordHelper extends Component {
  state = {
    loading: false,
    contains: '',
    notContains: '',
    words: []
  }

  onContainsChange = (chars) => {
    this.setState({ contains: chars }, this.getData)
  }

  onNotContainsChange = (chars) => {
    this.setState({ notContains: chars }, this.getData)
  }

  genPath() {
    let { contains, notContains } = this.state
    let params = `in=${contains}&notin=${notContains}`
    return `http://localhost:3000/api/words?${params}`
  }

  getData() {
    this.setState({ loading: true })

    fetch(this.genPath())
      .then(result => result.json())
      .then(({ words }) => {
        this.setState({ loading: false, words })
        console.log(result)
      })
  }

  render() {
    return (
      <>
        <h3>Find words</h3>

        <p>containing the letters</p>
        <Input onChange={this.onContainsChange} />

        <p>don't contain</p>
        <Input onChange={this.onNotContainsChange} />

        <WordSummary words={this.state.words} />
      </>
    )
  }
}

export default WordHelper
