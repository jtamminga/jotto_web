import React from 'react'

export default function Username({
  username,
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
          value={username}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <div>
        { users.map((user, i) =>
          <div key={i}>{user.username} ({user.connected ? 'connected' : 'disconnected'})</div>
        )}
      </div>
      <button onClick={onSubmit} disabled={waiting}>
        { waiting ? 'Waiting...' : 'Next' }
      </button>
    </>
  )
}