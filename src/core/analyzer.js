import { intersect, union, subtract } from "./utils"

const alphebet = 'abcdefghijklmnopqrstuvwxyz'.split('')

export default function analyzer(words) {
    let found = words.reduce((chars, word) =>
        intersect(chars, word), alphebet)

    let eliminated = subtract(alphebet,
        words.reduce((chars, word) => union(chars, word), []))

    return {
        found,
        eliminated
    }
}