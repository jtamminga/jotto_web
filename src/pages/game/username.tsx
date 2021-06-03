import { useState } from 'react';
import UserList from 'components/game/user-list';
import { WaitingContext } from 'core/context';

type Props = {
  onSubmit: (username: string) => void;
}

export default function Username({
  onSubmit
}: Props) {
  const [ username, setUsername ] = useState('');

  return (
    <div className="container-narrow">
      <div className="d-flex mb">
        <WaitingContext.Consumer>
          { waiting =>
            <>
              <input
                placeholder="Enter Name"
                disabled={waiting}
                value={username}
                maxLength={5}
                onChange={e => setUsername(e.target.value)}
              />

              <button
                className="btn ml"
                onClick={() => onSubmit(username)}
                disabled={waiting}
                style={{ width: 150 }}
              >
                { waiting ? 'Waiting...' : 'Next' }
              </button>
            </>
          }
        </WaitingContext.Consumer>
      </div>

      <UserList />
    </div>
  );
}