import React from 'react';
import classNames from 'classnames';
import './FarkleMessage.styles.scss';

type FarkleMessageProps = {
  farkled: boolean
}
const FarkleMessage = ({farkled}:FarkleMessageProps) => (
  <h2
    className={classNames('farkle-message', {
      is_visible: farkled
    })}
  >
    Farkle!
  </h2>
);

export default FarkleMessage;
