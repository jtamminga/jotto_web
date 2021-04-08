import React, { Component } from 'react';
import socket from '../../socket';
import Guess from './guess';
import { duplicates } from '../../core/utils';
import { User, PlayerTurn, OnlineGuess, WordError } from '../../core/types';
import PlayerHistory from './player-history';

type Props = {
  users: User[];
  playerOrder: string[];
  word: string;
  initialGuesses: OnlineGuess[],
  onUpdateUser: (user: Partial<User>) => void,
  onGameOver: () => void
}

type State = {
  currentTurn: string;
  guesses: OnlineGuess[];
  history: PlayerTurn[];
  hasWon: boolean;
}

class InGame extends Component<Props, State> {
  private id: number;
  private guessId: number;

  constructor(props: Props) {
    super(props);
    this.id = 0;
    this.guessId = 0;

    let guesses = props.initialGuesses.length > 0 ?
      props.initialGuesses : [this.addGuess()];

    this.state = {
      currentTurn: props.playerOrder[0],
      guesses,
      history: [],
      hasWon: false
    };
  }

  componentDidMount() {
    socket.on('turn', this.onTurn);
  }

  componentWillUnmount() {
    socket.off('turn');
  }

  isMyTurn(): boolean {
    return this.state.currentTurn === socket.userId;
  }

  getCurrentPlayer(): User | undefined {
    return this.props.users.find(user =>
      user.userId === this.state.currentTurn);
  }

  getOpponent(id: string): User {
    const { users, playerOrder } = this.props;
    const index = playerOrder.findIndex(i => i === id);
    const nextPlayerId = playerOrder[(index + 1) % playerOrder.length];
    const nextPlayer = users.find(u => u.userId === nextPlayerId);

    if (!nextPlayer) {
      throw new Error('Cannot find opponent');
    }

    return nextPlayer;
  }

  updatedHistory(turn: SocketTurn): PlayerTurn[] {
    const current = this.getCurrentPlayer();

    if (!current) {
      throw new Error('There is no current player');
    }

    const opponent = this.getOpponent(current.userId);

    const newTurn: PlayerTurn = {
      playerId: current.userId,
      playerName: current.username,
      opponentId: opponent.userId,
      opponentName: opponent.username,
      word: turn.word,
      common: turn.common
    };

    return [...this.state.history, newTurn];
  }

  onTurn = (turn: SocketTurn) => {
    const { common, won, gameOver, nextPlayer } = turn;

    if (this.isMyTurn()) {
      const guesses = this.updateGuess(this.guessId, { common });

      // only add a new guess if the player didn't win
      if (!won) {
        guesses.push(this.addGuess());
      }

      this.setState({ guesses, hasWon: won });
    }

    if (gameOver) {
      this.props.onGameOver();
    }

    if (won) {
      this.props.onUpdateUser({ userId: this.state.currentTurn, won });
    }

    this.setState({
      currentTurn: nextPlayer,
      history: this.updatedHistory(turn)
    });
  }

  addGuess(): OnlineGuess {
    return {
      id: this.id++,
      word: '',
      common: '',

      submitted: false,

      invalidChar: false,
      wordShort: true,
      doubleLetter: false,
      badNumber: false
    };
  }

  validGuess(word: string): WordError {
    return {
      invalidChar: !/^[a-z]*$/.test(word),
      wordShort: word.length !== 5,
      doubleLetter: duplicates([...word]).length > 0
    };
  }

  setGuesses(id: number, guess: Partial<OnlineGuess>): void {
    this.setState({ guesses: this.updateGuess(id, guess) });
  }

  updateGuess(id: number, guess: Partial<OnlineGuess>): OnlineGuess[] {
    return this.state.guesses.map(g => {
      if (g.id !== id) return g;

      const updated = { ...g, ...guess };
      const errors = this.validGuess(updated.word);
      return { ...updated, ...errors };
    });
  }

  submitGuess(guess: OnlineGuess): void {    
    const guesses = this.updateGuess(guess.id, { submitted: true });
    socket.emit('submit_guess', guess.word);

    // set the latest guessId
    this.guessId = guess.id;

    // guesses.push(this.addGuess());
    this.setState({ guesses });
  }

  renderGuesses(guesses: OnlineGuess[]) {
    return guesses.map((guess, i) =>
      <Guess
        key={i}
        onChange={this.setGuesses.bind(this, guess.id)}
        onSubmit={this.submitGuess.bind(this, guess)}
        submittable={this.isMyTurn()}
        {...guess}
      />
    );
  }

  render() {
    const { word } = this.props;
    const { guesses, history, hasWon } = this.state;
    const curUsername = this.getCurrentPlayer()?.username;

    return (
      <>
        <div className="header">
          <h3>Five Letters</h3>
        </div>

        <PlayerHistory history={history} />

        <div>My word: {word}</div>
        <div>My turn: {this.isMyTurn() ? 'yes' : 'no'}</div>
        <div>current: {curUsername}</div>

        <div className="guesses-container">
          <div className="guesses">
            {this.renderGuesses(guesses)}
          </div>
        </div>

        { hasWon &&
          <div>You won!</div>
        }
      </>
    )
  }
}

type SocketTurn = {
  word: string;
  common: number;
  nextPlayer: string;
  gameOver: boolean;
  won: boolean;
}

export default InGame;

