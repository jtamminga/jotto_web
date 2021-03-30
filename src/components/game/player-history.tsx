import { PlayerTurn } from '../../core/types';

type Props = {
  history: PlayerTurn[];
}

export default function PlayerHistory({ history }: Props) {
  return (
    <div>
      { history.map((item, i) =>
        <div key={i}>
          <span>[{item.playerName}</span>
          <span>{'=>'}</span>
          <span>{item.opponentName}</span>
          <span> </span>
          <span>word: {item.word}, </span>
          <span>common: {item.common}] </span>
        </div>
      )}
    </div>
  );
}