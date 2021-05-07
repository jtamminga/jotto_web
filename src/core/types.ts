export interface WordError {
  invalidChar: boolean;
  wordShort: boolean;
  doubleLetter: boolean;
}

export enum GameState {
  PICK_USERNAME,
  PICK_WORD,
  START,
  GAME_OVER
}

export interface Guess extends WordError {
  id: number;
  word: string;
  common: number | string;

  badNumber: boolean
}

export interface OnlineGuess extends Guess {
  submitted: boolean;
}

export interface User {
  userId: string;
  sessionId: string;
  username: string;
  connected: boolean;
  ready: boolean;
  won: boolean;
}

export interface PlayerTurn {
  playerId: string;
  playerName: string;
  opponentId: string;
  opponentName: string;
  word: string;
  common: number;
}