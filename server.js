// Server Side Render

const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const botName = 'Aman Sharma'

// Set Static Folder
const publicPath = path.join(__dirname,'public')
app.use(express.static(publicPath))

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom',({username,room})=>{
            const user = userJoin(socket.id,username,room)
    socket.join(user.room)


// Welcome Current User
socket.emit('message',formatMessage(botName,'Welcome to my Chat App'))

// Broadcast when a user connects
socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} joined the chat`))

// Send users and room info
io.to(user.room).emit('roomUsers',{
    room:user.room,
    users: getRoomUsers(user.room)
})

    })

    
    
    // Listen for chat message
    
    socket.on('chatMessage',msg=>{
const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message',formatMessage(user.username, msg))
    })
    
    //Broadcast when user disconnects
    socket.on('disconnect',()=>{

        const user = userLeave(socket.id)

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))
        }
        
    })
})





console.log("server starts!!!")
server.listen(8000)