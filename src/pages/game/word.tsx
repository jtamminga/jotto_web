import { useState } from 'react';
import WordInput from 'components/game/word-input';
import UserList from 'components/game/user-list';
import { WaitingContext } from 'core/context';

type Props = {
  onSubmit: (word: string) => void;
}

export default function Word({
  onSubmit
}: Props) {
  const [ word, setWord ] = useState('');

  return (
    <div className="container-narrow">
      <div className="d-flex mb">
        <WordInput
          word={word}
          onChange={setWord}
        />

        <WaitingContext.Consumer>
          { waiting =>
            <button
              className="btn ml"
              onClick={() => onSubmit(word)}
              disabled={waiting}
              style={{ width: 150 }}
            >
              { waiting ? 'Waiting...' : 'Ready' }
            </button>
          }
        </WaitingContext.Consumer>
        
      </div>
      
      <UserList showReadyState />
    </div>
  );
}