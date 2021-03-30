import React from 'react';
import { User } from '../../core/types';
import UserItem from './user'

type Props = {
  username: string;
  users: User[];
  waiting: boolean;
  onSubmit: () => void;
  onChange: (username: string) => void;
}

export default function Username({
  username,
  users,
  waiting,
  onSubmit,
  onChange
}: Props) {
  return (
    <div className="container-narrow">
      <div className="mb">
        <input
          placeholder="Enter Name"
          disabled={waiting}
          value={username}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <div className="user-list">
        { users.map((user, i) =>
          <UserItem key={i} {...user} />
        )}
      </div>
      <button className="btn" onClick={onSubmit} disabled={waiting}>
        { waiting ? 'Waiting...' : 'Next' }
      </button>
    </div>
  );
}