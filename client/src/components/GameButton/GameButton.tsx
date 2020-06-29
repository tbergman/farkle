import React from 'react';
import classNames from 'classnames';
import './GameButton.styles.scss';


type buttonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  children: React.ReactNode
  id?: string,
  className?: string,
  tooltip?: string,
  isDisabled?: boolean
}
const GameButton = ({ onClick, id, className, isDisabled, tooltip, children }: buttonProps) => (
  <button 
    className={classNames("gameButton", {'disabled': isDisabled}, {'tooltip': !!tooltip}, className)} 
    id={id}
    onClick={onClick}
    title={tooltip}
    data-tooltip={tooltip}
    disabled={isDisabled}
  >{children}</button>
);

export default GameButton;
