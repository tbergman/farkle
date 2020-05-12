import React from 'react';

type ScoreTableProps = {
  scores: Array<number>
}
const ScoreTable = ({scores}: ScoreTableProps) => (
  <table style={{color: 'white', position: 'absolute', right: '16px', top: '16px'}}> 
    <thead>
      <tr>
        {scores.map((_,id) => (
          <th key={id}>Player {id + 1}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        {scores.map((score, id) => (
          <td key={id}>{score}</td>
        ))}
      </tr>
    </tbody>
  </table>
);


export default ScoreTable;
