import { Guess, WordError } from './types';
import { chunks, duplicates, numIntersect } from './utils'

class Words {
    all: string[]; // all the words

    constructor() {
        this.all = this.getWords();
    }

    makesSense(word: string, guess: Guess): boolean {
        return numIntersect([...word], [...guess.word]) === guess.common;
    }

    getWords(): string[] {
        const wordsComponent = document.getElementById('words');

        if (!wordsComponent) {
            throw new Error('Cannot find words dictionary');
        }

        const data = wordsComponent.innerHTML;
        return chunks(data, 5);
    }

    withGuesses(guesses: Guess[]): string[] {
        return this.all.filter(w =>
            guesses.every(g => this.makesSense(w, g)));
    }
}

export function validWord(word: string): WordError {
    return {
        invalidChar: !/^[a-z]*$/.test(word),
        wordShort: word.length !== 5,
        doubleLetter: duplicates([...word]).length > 0
    };
}

export function wordErrors(word: string, isFocused: boolean): string[] {
    const { invalidChar, wordShort, doubleLetter } = validWord(word);
    const errors = [];

    if (word === '') {
        return [];
    }

    if (invalidChar) {
      errors.push('Word can only contain letters');
      return errors;
    }

    if (doubleLetter) {
      errors.push('Word cannot have a double letter');
      return errors;
    }

    if (wordShort && !isFocused) {
      errors.push('Word must be a 5 letter word');
    }

    return errors;
}

export default new Words();