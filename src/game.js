import React, { Component } from 'react'
import Username from './components/game/username'
import Word from './components/game/word'
import InGame from './components/game/in-game'
import socket from './socket'

class Game extends Component {
  state = {
    username: '',
    gameState: 'PICK_USERNAME',
    connected: false,
    waiting: false,
    users: [],
    word: ''
  }

  componentDidMount() {
    const sessionId = localStorage.getItem('sessionId')

    if (sessionId) {
      socket.auth = { sessionId }
      socket.connect()
    }

    socket.on('session', ({ sessionId, userId }) => {
      // use for authentication from now on
      socket.auth = { sessionId }
      // store the session id
      localStorage.setItem('sessionId', sessionId)
      // save the userId
      socket.userId = userId

      this.setState({ connected: true })
    })

    socket.on('users', users => {
      const me = users.find(u => u.userId == socket.userId)
      this.setState({ waiting: true, users, username: me.username })
    })

    socket.on('user_connect', user => {
      this.updateUser(user)
    })

    socket.on('user_disconnect', userId => {
      this.updateUser({ userId, connected: false })
    })

    socket.on('word_picking', () => {
      setTimeout(() => {
        this.setState({ waiting: false, gameState: 'PICK_WORD' })
      }, 2000)
    })

    socket.on('game_start', ({ nextPlayer, playerOrder }) => {
      setTimeout(() => {
        this.setState({ waiting: false, gameState: 'GAME_START', startPlayer: nextPlayer })
      }, 2000)
    })

    socket.on('user_ready', userId => {
      this.updateUser({ userId, ready: true })
    })

    socket.on('connect_error', (err) => {
      if (err.message === 'invalid username') {
        console.error('invalid username')
        this.setState({ waiting: false })
      }
    })
  }

  componentWillUnmount() {
    socket.off('session')
    socket.off('connect_error')
    socket.off('users')
    socket.off('user_connect')
    socket.off('user_disconnect')
    socket.off('word_picking')
    socket.off('game_start')
  }

  onUsernameChange = (username) => {
    this.setState({ username })
  }

  onUsernameSubmit = () => {
    socket.auth = { username: this.state.username }
    socket.connect();
    this.setState({ waiting: true })
  }

  onWordChange = (word) => {
    this.setState({ word })
  }

  onWordSubmit = () => {
    socket.emit('submit_word', this.state.word)
    this.updateUser({ userId: socket.userId, ready: true })
    this.setState({ waiting: true })
  }

  updateUser(user) {
    const index = this.state.users
      .findIndex(u => u.userId === user.userId)

    if (index === -1) {
      this.setState(state => {
        return { users: [...state.users, user] }
      })
    } else {
      const users = [...this.state.users]
      const updated = { ...users[index], ...user }
      users[index] = updated
      this.setState({ users })
    }
  }

  render() {
    const { gameState, users, waiting, username, word } = this.state

    if (gameState === 'PICK_USERNAME') {
      return (
        <Username
          username={username}
          users={users}
          waiting={waiting}
          onChange={this.onUsernameChange}
          onSubmit={this.onUsernameSubmit}
        />
      )
    }

    if (gameState === 'PICK_WORD') {
      return (
        <Word
          word={word}
          users={users}
          waiting={waiting}
          onChange={this.onWordChange}
          onSubmit={this.onWordSubmit}
        />
      )
    }

    return (
      <InGame
        users={users}
        word={word}
        startPlayer={this.state.startPlayer}
      />
    )
  }
}

export default Game