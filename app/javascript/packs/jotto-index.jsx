import React from 'react'
import ReactDOM from 'react-dom'
import JottoHelper from './pages/jotto.jsx'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <JottoHelper />,
    document.body.appendChild(document.createElement('div')),
  )
})
