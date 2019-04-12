var express = require('express');
var app = express();
var io = require('socket.io')();


const port = process.env.PORT || 3000;

//tell express where our static files are _js, images, css, etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () =>   {
    console.log(`app is running on port ${port}`);
});

// socket.io chat app stuff to follow
io.attach(server);

io.on('connection', function(socket) {
    console.log('a user has joined');

    socket.emit('connected', {sID: `${socket.id}`, message: 'new connection'} );

    socket.on('chat message', function(msg) {
        console.log('message: ', msg, 'socket:', socket.id);

        //send the message to everyone connected to the app
        io.emit('chat message', { id: `${socket.id}`, message: msg });
    });

    

    socket.on('disconnect', function(){
        console.log('a user has disconnected');
    });



});