import { createServer } from "node:http" // Crear el servidor HTTP
import next from "next" // Crear la aplicación web
import { Server } from "socket.io" // Crear el servidor WebSocket que gestiona las conexiones en tiempo real
import { v4 as uuidv4 } from "uuid" // Generar identificadores únicos UUID

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000
const app = next({ dev, hostname, port }) // Instancia de Next.js, configurada para trabajar en el entorno de desarrollo o producción
const handler = app.getRequestHandler() // Manejador de solicitudes de Next.js

let onlineUsers = []

/* ACIONES */
const addUser = (username, socketId) => {
  const isExist = onlineUsers.find(user => user.socketId === socketId)

  if (!isExist) {
    onlineUsers.push({ username, socketId })
    console.log(`¡Usuario ${username} agregado!`)
  }
}

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
  console.log(`¡Usuario removido!`)
}

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username)
}
/* FIN ACCIONES */

app.prepare().then(() => { // Preparar la aplicación Next.js
  const httpServer = createServer(handler) // Crear un servidor HTTP usando el manejador
  const io = new Server(httpServer) // Crear una nueva instancia Server de socket.io que se asocia al servidor HTTP

  io.on("connection", (socket) => {
    // Evento cuando un nuevo usuario se conecta
    socket.on("newUser", (username) => {
      addUser(username, socket.id)
    })

    // Evento para enviar una notificación a otro usuario
    socket.on("sendNotification", ({ receiverUsername, data }) => {
      const receiver = getUser(receiverUsername)
      console.log("receiver", receiver)

      io.to(receiver.socketId).emit("getNotification", {
        id: uuidv4(),
        ...data,
      })
    })

    // Evento cuando un usuario se desconecta
    socket.on("disconnect", () => {
      removeUser(socket.id)
    })
  })

  // Manejar el error de servidor y luego iniciar el servidor HTTP en el puerto 3000
  httpServer
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`Listo en http://${hostname}:${port}`)
    })
})