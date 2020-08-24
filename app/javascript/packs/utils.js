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
  for (var char of chars) {
    hash[char] = hash[char] === undefined ? 1 : hash[char] + 1
  }

  let dups = []
  for (var char in hash) {
    if (hash[char] > 1) dups.push(char)
  }

  return dups
}

export function wordValid(chars) {
  return chars.length == 5 && duplicates(chars).length == 0
}
