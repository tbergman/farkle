import React from 'react';
import classNames from 'classnames';
import './FarkleMessage.styles.scss';

type FarkleMessageProps = {
  isVisible: boolean
}
const FarkleMessage = ({isVisible}:FarkleMessageProps) => (
  <h2
    className={classNames('farkle-message', {
      is_visible: isVisible
    })}
  >
    Farkle!
  </h2>
);

export default FarkleMessage;
