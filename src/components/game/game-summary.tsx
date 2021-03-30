import React from 'react';
import { GameSummary as Summary } from '../../game';

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