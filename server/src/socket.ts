
import { Machine, MachineConfig, interpret, Interpreter } from 'xstate';
import { createFarkleGame, gameEvent, gameContext, gameMachine} from './game/Farkle'
import { Player, newPlayer } from './game/player';

export const initSocket = (io: SocketIO.Namespace, allGames: { [key: string]: SocketIO.Namespace }) => {
  let Game: gameMachine;
  let GameService: Interpreter<gameContext, any, gameEvent>
  let players: Array<Player> = []

  io.on('connection', socket => {
    console.log(`A user connected to ${io.name}`)
    socket.send('Opened connection')
    let player: Player;
    
    socket.on('join', (user: {name: string}) => {
      console.log(user)
      player = newPlayer(players.length, user.name)
      players.push(player)
      console.log(players)
      io.emit('players', players)
    })

    socket.on('action', (action: gameEvent | { type: 'START_GAME' }) => {
      // When we receive an action from the client
      // Forward that on to the game machine
      console.log('Received action', action)
      if(action.type === "START_GAME") {
        Game = createFarkleGame(players)
        GameService = interpret(Game)
        GameService.start()
        GameService.onTransition(state => {
          io.emit('update', JSON.stringify(state))
        })
      } else {
        GameService.send(action)
      }
    })

    socket.on('disconnect', () => {
      console.log(`${player.name} disconnected`)
    })

  })

}
