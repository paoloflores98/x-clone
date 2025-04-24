import { createServer } from "node:http"
import next from "next"
import { Server } from "socket.io"
import { v4 as uuidv4 } from "uuid"

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

let onlineUsers = []

/* ACIONES */
const addUser = (username, socketId) => {
  const isExist = onlineUsers.find(user => user.socketId === socketId)
  
  // Verificar si existe el usuario
  if (!isExist) {
    onlineUsers.push({ username, socketId })
    console.log(`¡Usuario ${username} agregado!`)
  }
}

const removeUser = (username, socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
  console.log(`¡Usuario ${username} removido!`)
}

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username)
}
/* FIN ACCIONES */

app.prepare().then(() => {
  const httpServer = createServer(handler)
  const io = new Server(httpServer)
  
  io.on("connection", (socket) => {
    // console.log("Conectado", socket)

    /* INICIO */
    socket.on("newUser", (username) => {
      addUser(username, socket.id)
    })

    // Enviar notificaciones
    socket.on("sendNotification", ({ receiverUsername, data }) => {
      const receiver = getUser(receiverUsername)
      console.log("receiver", receiver)

      io.to(receiver.socketId).emit("getNotification", {
        id: uuidv4(),
        ...data,
      })
    })

    socket.on("disconnect", () => {
      removeUser(socket.id)
    })
    /* FIN */
  })

  httpServer
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`Listo en http://${hostname}:${port}`)
    })
})