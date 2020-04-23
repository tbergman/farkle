import React from 'react';
import { Player } from '../../game/Player';

type ScoreTableProps = {
  players: Array<Player>
}
const ScoreTable = ({players}: ScoreTableProps) => (
  <table>
    <thead>
      <tr>
        {players.map((player) => (
          <th key={player.id}>Player {player.id + 1}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        {players.map((player) => (
          <td key={player.id}>{player.score}</td>
        ))}
      </tr>
    </tbody>
  </table>
);


export default ScoreTable;
