import React from 'react';
import classNames from 'classnames';
import './GameButton.styles.scss';


type buttonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  children: React.ReactNode
  id?: string,
  className?: string,
  size?: 'small' | 'large',
  tooltip?: string,
  isDisabled?: boolean,
  disabledTooltip?: string,
  disabledAction?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
const GameButton = ({ onClick, id, className, size, isDisabled, tooltip, disabledTooltip, disabledAction, children }: buttonProps) => (
  <button 
    className={classNames("gameButton", {'disabled': isDisabled}, {'tooltip': !!tooltip}, size, className)} 
    id={id}
    onClick={onClick}
    title={(isDisabled && disabledTooltip) ? disabledTooltip : tooltip}
    data-tooltip={(isDisabled && disabledTooltip) ? disabledTooltip : tooltip}
    disabled={isDisabled}
  >{children}</button>
);

export default GameButton;
