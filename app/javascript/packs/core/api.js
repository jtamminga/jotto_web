const baseUrl = 'http://localhost:3000/api/'

export function fetchWords(contains, notContains) {
  const params = `in=${contains}&notin=${notContains}`
  const url = `${baseUrl}words?${params}`
  return fetch(url).then(result => result.json())
}

export function fetchGuesses(guesses) {
  return fetch(`${baseUrl}jotto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ guesses })
  }).then(result => result.json())
}
