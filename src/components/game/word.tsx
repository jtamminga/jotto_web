import React from 'react';
import { User } from '../../core/types';

type Props = {
  word: string;
  users: User[];
  waiting: boolean;
  onSubmit: () => void;
  onChange: (word: string) => void;
}

export default function Word({
  word,
  users,
  waiting,
  onSubmit,
  onChange
}: Props) {
  return (
    <div className="container-narrow">
      <div className="mb">
        <input
          placeholder="Enter Word"
          disabled={waiting}
          value={word}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <div className="user-list">
        { users.map((user, i) =>
          <div key={i}>{user.username} ({user.ready ? 'connected' : 'disconnected'})</div>
        )}
      </div>
      <button className="btn" onClick={onSubmit} disabled={waiting}>
        { waiting ? 'Waiting...' : 'Ready' }
      </button>
    </div>
  );
}