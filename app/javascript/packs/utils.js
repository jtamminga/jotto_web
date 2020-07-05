export function sample(arr, numElements) {
  let result = []
  for (var i = 0; i < numElements; i++) {
    result.push(arr[Math.floor(Math.random() * arr.length)])
  }

  return result.length == 1 ? result[0] : result
}
