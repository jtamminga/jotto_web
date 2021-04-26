import { User } from '../../core/types';
import UserConnected from './user-connected'

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
      <div className="d-flex mb">
        <input
          placeholder="Enter Name"
          disabled={waiting}
          value={username}
          maxLength={5}
          onChange={e => onChange(e.target.value)}
        />

        <button
          className="btn ml"
          onClick={onSubmit}
          disabled={waiting}
          style={{ width: 150 }}
        >
          { waiting ? 'Waiting...' : 'Next' }
        </button>
      </div>
      <div className="user-list">
        { users.map((user, i) =>
          <UserConnected key={i} {...user} />
        )}
      </div>
    </div>
  );
}