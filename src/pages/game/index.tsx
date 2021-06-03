import React, { Component } from 'react';
import Username from './username';
import Word from 'pages/game/word';
import InGame from 'pages/game/in-game';
import EndGameSummary from 'components/game/game-summary';
import socket, { updateSocketAuth } from 'socket';
import { User, GameState, PlayerTurn } from 'core/types';
import { UsersContext, SessionContext, WaitingContext } from 'core/context';
import 'styles/app-online.scss';

type State = {
  gameState: GameState;
  connected: boolean;
  waiting: boolean;
  users: User[];
  playerOrder: string[];
  word: string;
  gameSummary: GameSummary[],
  history: PlayerTurn[]
}

class Game extends Component<{}, State> {
  state: Readonly<State> = {
    gameState: GameState.PICK_USERNAME,
    connected: false,
    waiting: false,
    users: [],
    playerOrder: [],
    word: '',
    gameSummary: [],
    history: []
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
      const getUsername = (userId: string) => {
        const user = gameState.users.find(user => user.userId === userId);
        if (!user) throw new Error('Cannot find user');
        return user.username;
      }

      // transform data
      const history: PlayerTurn[] = gameState.history.map(turn => ({
        playerId: turn.from,
        playerName: getUsername(turn.from),
        opponentId: turn.to,
        opponentName: getUsername(turn.to),
        word: turn.word,
        common: turn.common
      }));

      this.setState({
        gameState: gameState.state,
        users: gameState.users,
        word: gameState.word,
        playerOrder: gameState.playerOrder,
        history
      })
    });

    socket.on('users', (users: User[]) => {
      const me = users.find(u => u.userId === socket.userId);

      if (!me) {
        throw new Error('Cannot find myself');
      }

      this.setState({ waiting: true, users });
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
    socket.offAny();
  }

  onUsernameSubmit = (username: string) => {
    updateSocketAuth({ username });
    socket.connect();
    this.setState({ waiting: true });
  }

  onWordSubmit = (word: string) => {
    socket.emit('submit_word', word);
    this.updateUser({ userId: socket.userId, ready: true });
    this.setState({ word, waiting: true });
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
      word,
      playerOrder,
      gameSummary,
      history
    } = this.state;

    switch (gameState) {
      case GameState.PICK_USERNAME:
        return (
          <Username onSubmit={this.onUsernameSubmit} />
        );

      case GameState.PICK_WORD:
        return (
          <Word onSubmit={this.onWordSubmit} />
        );
        
      case GameState.START:
        return (
          <InGame
            users={users}
            word={word}
            playerOrder={playerOrder}
            initialHistory={history}
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
      <SessionContext.Provider value={socket.userId}>
        <UsersContext.Provider value={this.state.users}>
          <WaitingContext.Provider value={this.state.waiting}>
            { this.renderParts() }
          </WaitingContext.Provider>
        </UsersContext.Provider>
      </SessionContext.Provider>
    )
  }
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
  history: { from: string, to: string, word: string, common: number }[];
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