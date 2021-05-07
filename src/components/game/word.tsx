import { User } from '../../core/types';
import UserConnected from './user-ready';
import WordInput from './word-input';

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
      <div className="d-flex mb">
        {/* <input
          placeholder="Enter Word"
          disabled={waiting}
          value={word}
          onChange={e => onChange(e.target.value)}
        /> */}

        <WordInput
          word={word}
          onChange={onChange}
        />

        <button
          className="btn ml"
          onClick={onSubmit}
          disabled={waiting}
          style={{ width: 150 }}
        >
          { waiting ? 'Waiting...' : 'Ready' }
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