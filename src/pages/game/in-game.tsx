import { Component } from 'react';
import socket from 'socket';
import Guess from 'components/game/guess';
import { User, PlayerTurn, OnlineGuess } from 'core/types';
import PlayerHistory from 'components/game/player-history';
import { validWord } from 'core/words';
import 'core/arrays';

type SocketTurn = {
  word: string;
  common: number;
  nextPlayer: string;
  gameOver: boolean;
  won: boolean;
}

type Props = {
  users: User[];
  playerOrder: string[];
  word: string;
  initialHistory: PlayerTurn[],
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

    this.state = {
      currentTurn: props.playerOrder[0],
      guesses: this.historyToGuesses(props.initialHistory),
      history: props.initialHistory,
      hasWon: props.users.findUser(socket.userId).won
    };
  }

  historyToGuesses(history: PlayerTurn[]): OnlineGuess[] {
    let guesses: OnlineGuess[] = history
      .filter(turn => turn.playerId === socket.userId)
      .map((turn, i) => ({
        id: i,
        word: turn.word,
        common: turn.common,
        invalidChar: false,
        wordShort: false,
        doubleLetter: false,
        badNumber: false,
        submitted: true
      }));

    this.id = guesses.length;
    guesses.push(this.addGuess());

    return guesses;
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
    return users.findUser(nextPlayerId);
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

  setGuesses(id: number, guess: Partial<OnlineGuess>): void {
    this.setState({ guesses: this.updateGuess(id, guess) });
  }

  updateGuess(id: number, guess: Partial<OnlineGuess>): OnlineGuess[] {
    return this.state.guesses.map(g => {
      if (g.id !== id) return g;

      const updated = { ...g, ...guess };
      const errors = validWord(updated.word);
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

  renderMyWord() {
    const { word } = this.props;

    return (
      <div className="d-flex">
        My word
        <div className="ml-s label">
          {word}
        </div>
      </div>
    );
  }

  renderCurrentTurn() {
    const curUsername = this.getCurrentPlayer()?.username;
    const myTurn = this.isMyTurn();

    return (
      <div className="d-flex">
        <span>Current turn</span>
        <div className={'ml-s label' + (myTurn ? ' label-success' : '')}>
          {curUsername}
        </div>
      </div>
    );
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
    const { guesses, history, hasWon } = this.state;

    return (
      <>
        <div className="d-flex mb">
          {this.renderMyWord()}
          {this.renderCurrentTurn()}
        </div>

        <PlayerHistory history={history} />

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

export default InGame;

