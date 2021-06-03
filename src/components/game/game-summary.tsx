import { GameSummary as Summary } from 'pages/game';

type Props = {
  summary: Summary[]
}

export default function GameSummary({
  summary
}: Props) {
  return (
    <>
      { summary.map(player =>
        <div>{player.place}: {player.username}</div> 
      )}

      <div>
        <button>Play Again</button>
        <button>Quit</button>
      </div>
    </>
  );
}