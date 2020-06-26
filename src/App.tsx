import React, { useState } from 'react';
import GameIntro from './components/GameIntro';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Game from './components/Game';
import { Player } from './game/player';

const AppRouterContext = () => {
  const [players, setPlayers] = useState<Array<Player>>([])

  const startGame = (players: Array<Player>) => {
    storePlayers(players)
    setPlayers(players)
  }

  const storePlayers = (players: Array<Player>) => {
    localStorage.setItem('farkle-players', JSON.stringify(players))
  }

  return (
    <>
    { players.length > 0 && <Redirect to='/play' />}
    <Switch>
      <Route path="/play">
        <Game players={players} />
      </Route>
      <Route path="/">
        <GameIntro startGame={startGame} />
      </Route>
    </Switch>
    </>
  )
}

const App = () => {

  return (
    <div className="App">

      <Router> 
        <AppRouterContext />
      </Router>
    </div>
  );
}



export default App;
