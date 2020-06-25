import React from 'react';
import './GameSourceConfig.styles.scss';
import GameButton from '../../GameButton';

type GameSourceConfig = {
  setSource: (x: 'server' | 'client' | null) => void
}

const GameSourceConfig = ({ setSource } : GameSourceConfig) => {
  return (
    <form id="source-config-form">
      <label id="source-config-label">Play online or locally?</label>
      <div className="source-config-btn-wrapper">
        <GameButton 
          className="source-config-btn"
          id="source-config-btn-client"
          onClick={() => setSource('client')} 
          tooltip="Each player takes their turn on this device."> Local </GameButton>
        <GameButton 
          className="source-config-btn"
          id="source-config-btn-server"
          onClick={() => setSource('server')} 
          isDisabled={true} 
          tooltip="Coming soon!"> Online </GameButton>
      </div>
    </form>
  )
}

export default GameSourceConfig;
