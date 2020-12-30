import { chunks, intersectLen } from './utils'

class Words {
    constructor() {
        this.all = this.getWords()
    }

    makesSense(word, guess) {
        return intersectLen(word, guess.word) === guess.common
    }

    getWords() {
        const data = document.getElementById('words').content
        return chunks(data, 5)
    }

    withGuesses(guesses) {
        return this.all.filter(w =>
            guesses.every(g => this.makesSense(w, g)))
    }
} 

export default new Words();