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
