import React from 'react';
import './ScoreTable.styles.scss';
import classNames from 'classnames';

type ScoreTableProps = {
  names: Array<string>,
  scores: Array<number>,
  currentPlayer: number
}
const ScoreTable = ({names, scores, currentPlayer}: ScoreTableProps) => (
  <section className="score-table">
    {scores.map((score, id) => (
      <div 
        key={id}
        className={classNames("player-column", {current: id === currentPlayer})}>
        <h1 className="name">{names[id] || `Player ${id + 1}` }</h1>
        <h2 className="score">{score}</h2>
      </div>
    ))}
  </section>
);


export default ScoreTable;
