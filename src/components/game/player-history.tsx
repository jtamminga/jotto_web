import { PlayerTurn } from '../../core/types';

type Props = {
  history: PlayerTurn[];
}

function HistoryItem({
  playerName, opponentName, word, common }: PlayerTurn
) {
  return (
    <div className="player-history-item">
      <div className="player">
        {playerName}
      </div>
      <svg className="arrow" viewBox="0 0 5 20">
          <polygon points="0,0 5,10 0,20" />
      </svg>
      <div className="opponent">
        {opponentName}
      </div>
      <div className="word">
        {word}
      </div>
      <div className="common">
        {common}
      </div>
    </div>
  );
}

export default function PlayerHistory({ history }: Props) {
  return (
    <div className="player-history">
      { history.map((item, i) =>
        <HistoryItem key={i} {...item} />
      )}
    </div>
  );
}