import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Helper from './helper'
import Game from './game'

export default function App() {
  return (
    <Switch>
      <Route path="/helper">
        <Helper />
      </Route>
      <Route path="/">
        <Game />
      </Route>
    </Switch>
  )
}