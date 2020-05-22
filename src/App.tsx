import React, { useState } from 'react';
import './App.scss';
import GameIntro from './components/GameIntro';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Game from './components/Game';

function App() {
  const [players, setPlayers] = useState<number>(0)
  const startGame = (n: number) => {
    setPlayers(n)
  }

  return (
    <div className="App">
      <Router>
      {players > 0 && <Redirect to='/play' />}
        <Switch>
          <Route path="/play">
            <Game players={players} />
          </Route>
          <Route path="/">
            <GameIntro startGame={startGame} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
