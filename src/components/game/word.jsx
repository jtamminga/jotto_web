import React from 'react'

export default function Word({
  word,
  users,
  waiting,
  onSubmit,
  onChange
}) {
  return (
    <>
       <div>
        <input
          disabled={waiting}
          value={word}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <div>
        { users.map((user, i) =>
          <div key={i}>{user.username} ({user.ready ? 'connected' : 'disconnected'})</div>
        )}
      </div>
      <button onClick={onSubmit} disabled={waiting}>
        { waiting ? 'Waiting...' : 'Ready' }
      </button>
    </>
  )
}