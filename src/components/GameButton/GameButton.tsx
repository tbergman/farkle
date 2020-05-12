import React from 'react';
import './GameButton.styles.scss';

type buttonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  children: React.ReactNode
}
const GameButton = ({onClick, children}:buttonProps) => (<button className="gameButton" onClick={onClick}>{children}</button>);

export default GameButton;
