import React from 'react';
import classNames from 'classnames';
import './WinnerMessage.styles.scss';

type WinnerMessageProps = {
  winner: number | null,
  score?: number
}
const WinnerMessage = ({ winner, score }: WinnerMessageProps) => (
  <div className="message-wrapper">
    <h2
      className={classNames('winner-message', {
        is_visible: !!winner && winner >= 0
      })}
    >
      Player { winner && winner + 1 } wins!
    </h2>
    {
      !!score && (
        <h3>
          With {score} points
        </h3>
      )
    }
  </div>
);

export default WinnerMessage;
