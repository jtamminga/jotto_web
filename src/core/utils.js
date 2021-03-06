export function sample(arr, n) {
  let len = arr.length

  n = Math.min(len, n)

  let result = new Array(n),
      taken = new Array(len);

  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }

  return result;
}

export function charClasses(char, found, eliminated) {
  let classes = []
  if (found.includes(char)) classes.push('found')
  if (eliminated.includes(char)) classes.push('eliminated')
  return classes
}

export function duplicates(chars) {
  let hash = {}
  for (let char of chars) {
    hash[char] = hash[char] === undefined ? 1 : hash[char] + 1
  }

  let dups = []
  for (let char in hash) {
    if (hash[char] > 1) dups.push(char)
  }

  return dups
}

export function chunks(str, len) {
  let chunks = []

  for (let i = 0; i < str.length; i += len) {
    chunks.push(str.substring(i, i + len))
  }

  return chunks
}

export function superset(a, b) {
  return intersectLen(a, b) === b.length
}

export function intersectLen(a, b) {
  let n = 0;
  for (let i = 0; i < a.length; i++) {
      n += b.includes(a[i])
  }

  return n
}

export function intersect(a, b) {
  return a.filter(n => b.includes(n))
}

export function subtract(a, b) {
  return a.filter(x => !b.includes(x))
}

export function union(a, b) {
  return [...new Set([...a, ...b])]
}

export function wordSearch(words, contains, notContains) {
  return words.filter(word =>
    superset(word, contains) && intersectLen(word, notContains) === 0)
}

export function arrayEqual(a, b) {
  if (a.length !== b.length) return false

  let sorted = a.slice().sort()
  return b.slice().sort().every((item, index) => item === sorted[index])
}

export function hasError(guess) {
  return guess.invalidChar || guess.wordShort || guess.doubleLetter || guess.badNumber
}