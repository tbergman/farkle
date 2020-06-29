
export const initSocket = (io: SocketIO.Namespace) => {
  let state = 0;
  io.on('connection', socket => {
    console.log(`A user connected to ${io.name}`)
    socket.send('MESASGAE')

    socket.on('action', action => {
      console.log(`Do something with ${action}`)
      state++
      io.emit('update', `State is now ${state}`)
    })

  })
}