import React, { useState, useRef, useEffect } from 'react';
import GameIntro from './components/GameIntro';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import io from 'socket.io-client';
import { Player } from './game/player';
import LocalGameConfig from './components/GameIntro/LocalGameConfig';
import RemoteGameConfig from './components/GameIntro/RemoteGameConfig';
import { gameContext, gameEvent } from './game/Farkle';
import { LocalGame, RemoteGame } from './components/Game/Game';
import { State } from 'xstate';

// type GameHost = 'server' | 'client'

const AppRouterContext = () => {
  const socket = useRef<SocketIOClient.Socket>()
  const [players, setPlayers] = useState<Array<Player>>([])
  const [isConnectedTo, setIsConnectedTo] = useState<string>('')
  const [remoteState, setRemoteState] = useState<State<gameContext, gameEvent, any, any>>()

  const startLocalGame = (players: Array<Player>) => {
    storePlayers(players)
    setPlayers(players)
  }
  const storePlayers = (players: Array<Player>) => {
    localStorage.setItem('farkle-players', JSON.stringify(players))
  }

  const connect = (code: string, name: string) => {
    socket.current = io.connect(`http://localhost:4000/${code}`)
    socket.current.on('connect', () => {
      console.log('Connected')
      if(socket.current) {
        socket.current.emit('join', { name })
      }
      setIsConnectedTo(code)
    })

    socket.current.on('players', (players: Array<Player>) => {
      setPlayers(players)
    })

    socket.current.on('update', (stateString: string) => {
      const state = State.create(JSON.parse(stateString))
      setRemoteState(state as State<gameContext, gameEvent, any, any>)
    })
  }

  const createGame = (name: string) => {
    fetch('http://localhost:4000/init')
      .then(resp => resp.json())
      .then(data => {
        console.log(`Created new room ${data.roomCode}`)
        connect(data.roomCode, name)
      })
  }

  const startRemoteGame = () => {
    if(socket.current) {
      socket.current.emit('action', { type: 'START_GAME' })
    }
  }

  const sendRemoteAction = (type: string, payload?: object) => {
    if(socket.current) {
      socket.current.emit('action', {type, ...payload})
    }
  }

  return (
    <>
    {/* { players.length > 0 && <Redirect to='/play/local' />} */}
    {remoteState && <Redirect to="play/online" />}
    <Switch>
      <Route path="/play/local">
        <LocalGame players={players} />
      </Route>

      <Route path="/play/online">
          <RemoteGame current={remoteState} send={sendRemoteAction}/>
      </Route>

      <Route path="/online">
        <GameIntro>
          <RemoteGameConfig 
            roomCode={isConnectedTo}
            players={players}
            connect={connect}
            create={createGame}
            start={startRemoteGame}
          />
          <Link to="/local" className="text-button">Play locally</Link>
        </GameIntro>
      </Route>

      <Route path="/local">
        <GameIntro>
          <LocalGameConfig startGame={startLocalGame} />
          <Link to="/online" className="text-button">Play online</Link>
        </GameIntro>
      </Route>

      <Route path="/">
        <Redirect to='/online' />
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
