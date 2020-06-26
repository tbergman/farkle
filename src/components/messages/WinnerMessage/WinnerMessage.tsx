import React from 'react';
import classNames from 'classnames';
import './WinnerMessage.styles.scss';
import { Player } from '../../../game/player';

type WinnerMessageProps = {
  winner: Player | null,
  score?: number
}
const WinnerMessage = ({ winner, score }: WinnerMessageProps) => (
    <>
    <h2
      className={classNames('winner-message', {
        is_visible: winner !== null
      })}
    >
      {winner?.name} wins!
    </h2>
    {
      !!score && (
        <h3>
          With {score} points
        </h3>
      )
    }
    </>
);

export default WinnerMessage;
