import React from 'react'
import ReactDOM from 'react-dom'
import WordHelper from './components/wordHelper.jsx'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <WordHelper />,
    document.body.appendChild(document.createElement('div')),
  )
})
