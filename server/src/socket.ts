
import { Machine, MachineConfig, interpret, Interpreter } from 'xstate';
import { createFarkleGame, gameEvent, gameContext, gameMachine} from './game/Farkle'
import { Player, newPlayer } from './game/player';

export const initSocket = (io: SocketIO.Namespace, allGames: { [key: string]: SocketIO.Namespace }) => {
  let Game: gameMachine;
  let GameService: Interpreter<gameContext, any, gameEvent>
  let Players: Array<Player> = []

  io.on('connection', socket => {
    console.log(`A user connected to ${io.name}`)
    socket.send('Opened connection')
    
    socket.on('join', (user: {name: string}) => {
      console.log(user)
      io.emit('message', `${user.name} joined`)
      Players.push(newPlayer(Players.length, user.name))
      console.log(Players)
    })

    socket.on('action', (action: gameEvent | { type: 'START_GAME' }) => {
      // When we receive an action from the client
      // Forward that on to the game machine

      if(action.type === "START_GAME") {
        Game = createFarkleGame(Players)
        GameService = interpret(Game)
        GameService.start()
        io.emit('update', Game.context)
      } else {
        GameService.send(action)
      }
    })

  })

}
