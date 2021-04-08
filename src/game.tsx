import React, { Component } from 'react';
import Username from './components/game/username';
import Word from './components/game/word';
import InGame from './components/game/in-game';
import EndGameSummary from './components/game/game-summary';
import socket, { updateSocketAuth } from './socket';
import { OnlineGuess, User, GameState } from './core/types';
import './styles/app-online.scss'

type State = {
  username: string;
  gameState: GameState;
  connected: boolean;
  waiting: boolean;
  users: User[];
  playerOrder: string[];
  word: string;
  gameSummary: GameSummary[],
  guesses: OnlineGuess[]
}

class Game extends Component<{}, State> {
  state: Readonly<State> = {
    username: '',
    gameState: GameState.PICK_USERNAME,
    connected: false,
    waiting: false,
    users: [],
    playerOrder: [],
    word: '',
    gameSummary: [],
    guesses: []
  }

  componentDidMount() {
    const sessionId = sessionStorage.getItem('sessionId');

    if (sessionId) {
      updateSocketAuth({ sessionId });
      socket.connect();
    }

    socket.on('session', ({ sessionId, userId }: SocketSession) => {
      // use for authentication from now on
      updateSocketAuth({ sessionId });

      // store the session id
      sessionStorage.setItem('sessionId', sessionId);
      // save the userId
      socket.userId = userId

      this.setState({ connected: true });
    });

    socket.on('restore_state', (gameState: SocketGameState) => {
      this.setState({
        gameState: gameState.state,
        users: gameState.users,
        word: gameState.word,
        guesses: gameState.guesses,
        playerOrder: gameState.playerOrder
      })
    });

    socket.on('users', (users: User[]) => {
      const me = users.find(u => u.userId === socket.userId);

      if (!me) {
        throw new Error('Cannot find myself');
      }

      this.setState({ waiting: true, users, username: me.username });
    });

    socket.on('user_connect', (user: User) => {
      this.updateUser(user);
    });

    socket.on('user_disconnect', (userId: string) => {
      this.updateUser({ userId, connected: false });
    });

    socket.on('word_picking', () => {
      setTimeout(() => {
        this.setState({ waiting: false, gameState: GameState.PICK_WORD });
      }, 2000);
    });

    socket.on('user_ready', (userId: string) => {
      this.updateUser({ userId, ready: true });
    });

    socket.on('game_start', ({ playerOrder }: SocketGameStart) => {
      setTimeout(() => {
        this.setState({
          waiting: false,
          gameState: GameState.START,
          playerOrder
        });
      }, 2000);
    });

    socket.on('end_game_summary', (gameSummary: GameSummary[]) => {
      setTimeout(() => {
        this.setState({
          gameState: GameState.GAME_OVER,
          gameSummary
        });
      }, 2000);
    });

    socket.on('connect_error', (err: { message: string }) => {
      if (err.message === 'invalid username') {
        console.error('invalid username');
        this.setState({ waiting: false });
      }
    });
  }

  componentWillUnmount() {
    socket.off('session');
    socket.off('connect_error');
    socket.off('users');
    socket.off('user_connect');
    socket.off('user_disconnect');
    socket.off('word_picking');
    socket.off('game_start');
  }

  onUsernameChange = (username: string) => {
    this.setState({ username });
  }

  onUsernameSubmit = () => {
    updateSocketAuth({ username: this.state.username });
    socket.connect();
    this.setState({ waiting: true });
  }

  onWordChange = (word: string) => {
    this.setState({ word });
  }

  onWordSubmit = () => {
    console.log('submit_word');
    socket.emit('submit_word', this.state.word);
    this.updateUser({ userId: socket.userId, ready: true });
    this.setState({ waiting: true });
  }

  updateUser(user: Partial<User>): void {
    const index = this.state.users
      .findIndex(u => u.userId === user.userId);

    if (index === -1) {
      // set defaults just in case
      const newUser: User = {
        userId: '',
        sessionId: '',
        username: '',
        connected: false,
        ready: false,
        won: false,
        ...user
      };

      this.setState(state => {
        return { users: [...state.users, newUser] };
      });
    } else {
      const users = [...this.state.users];
      const updated = { ...users[index], ...user };
      users[index] = updated;
      this.setState({ users });
    }
  }

  renderParts() {
    const {
      gameState,
      users,
      waiting,
      username,
      word,
      playerOrder,
      gameSummary,
      guesses
    } = this.state;

    switch (gameState) {
      case GameState.PICK_USERNAME:
        return (
          <Username
            username={username}
            users={users}
            waiting={waiting}
            onChange={this.onUsernameChange}
            onSubmit={this.onUsernameSubmit}
          />
        );

      case GameState.PICK_WORD:
        return (
          <Word
            word={word}
            users={users}
            waiting={waiting}
            onChange={this.onWordChange}
            onSubmit={this.onWordSubmit}
          />
        );
        
      case GameState.START:
        return (
          <InGame
            users={users}
            word={word}
            playerOrder={playerOrder}
            initialGuesses={guesses}
            onUpdateUser={this.updateUser.bind(this)}
            onGameOver={() => console.log('game over!')}
          />
        )

      case GameState.GAME_OVER:
        return (
          <EndGameSummary summary={gameSummary} />
        );
    }
  }

  render() {
    return (
      <SessionContext.Provider value={{ userId: socket.userId }}>
        { this.renderParts() }
      </SessionContext.Provider>
    )
  }
}

export const SessionContext = React.createContext<Context>({ userId: undefined });

type Context = {
  userId: string | undefined;
}

type SocketSession = {
  sessionId: string;
  userId: string;
}

type SocketGameStart = {
  nextPlayer: string;
  playerOrder: string[];
}

type SocketGameState = {
  state: GameState,
  currentTurn: string;
  guesses: OnlineGuess[];
  playerOrder: string[];
  users: User[];
  word: string;
}

export interface GameSummary {
  userId: string;
  username: string;
  place: number;
  word: string;
  numGuesses: number;
}

export default Game;