// const { response } = require('express');
const express = require('express');
const { Socket } = require('socket.io');
const app = express();
const server = require('http').Server(app)
const { v4: uuidv4 } = require('uuid')

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});


const io = require('socket.io')(server)


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/peerjs', peerServer);


app.get('/', (req, res) => {
    res.redirect(`/:${uuidv4()}`)
})
app.get('/:room', (req, res) => {
    res.render('room', {
        roomId: req.params.room
    })
})



io.on('connection', (Socket) => {
    Socket.on('join-room', (roomId, userId) => {
        console.log('new user joined the room');
        Socket.join(roomId)
        Socket.to(roomId).emit('user-connected', userId);


        Socket.on('message', (message) => {
            io.to(roomId).emit('createMessage', message);
        })
    })

})




server.listen(3000);