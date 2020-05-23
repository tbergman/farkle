import React, { useState } from 'react';
import './App.scss';
import GameIntro from './components/GameIntro';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import Game from './components/Game';

const AppRouterCtx = () => {
  const location = useLocation();
  const [players, setPlayers] = useState<number>(0)
  console.log(players <= 0 && location.pathname !== '/')
  const startGame = (n: number) => {
    setPlayers(n)
  }

  return (
    <>
    { players > 0 && <Redirect to='/play' />}
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
        <AppRouterCtx />
      </Router>
    </div>
  );
}



export default App;
