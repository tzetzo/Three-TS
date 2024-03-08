import express from 'express'
import path from 'path'
import http from 'http'
import { Server, Socket } from 'socket.io'

const PORT = process.env.PORT || 5000;
class App {
    private server: http.Server

    private io: Server
    private clients: any = {}

    constructor() {
        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))

        this.server = new http.Server(app)

        this.io = new Server(this.server)

        this.io.on('connection', (socket: Socket) => {
            console.log(socket.constructor.name)
            this.clients[socket.id] = {}
            console.log(this.clients)
            console.log('a user connected : ' + socket.id)
            socket.emit('id', socket.id)

            socket.on('disconnect', () => {
                console.log('socket disconnected : ' + socket.id)
                if (this.clients && this.clients[socket.id]) {
                    console.log('deleting ' + socket.id)
                    delete this.clients[socket.id]
                    this.io.emit('removeClient', socket.id)
                }
            })

            socket.on('update', (message: any) => {
                if (this.clients[socket.id]) {
                    this.clients[socket.id].t = message.t //client timestamp
                    this.clients[socket.id].p = message.p //position
                    this.clients[socket.id].r = message.r //rotation
                }
            })
        })

        setInterval(() => {
            this.io.emit('clients', this.clients)
        }, 50)
    }

    public Start() {
        this.server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}.`)
        })
    }
}

new App().Start()