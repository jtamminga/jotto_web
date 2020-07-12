export function sample(arr, numElements) {
  let result = []
  for (var i = 0; i < Math.min(arr.length, numElements); i++) {
    result.push(arr[Math.floor(Math.random() * arr.length)])
  }

  return result.length == 1 ? result[0] : result
}

export function charClasses(char, found, eliminated) {
  let classes = []
  if (found.includes(char)) classes.push('found')
  if (eliminated.includes(char)) classes.push('eliminated')
  return classes
}
