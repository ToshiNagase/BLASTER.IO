// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
});

/*setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);*/

//var players = {};
//var bullets = {};

var objects = {};

io.on('connection', function(socket) {

  /*socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });*/

  socket.on('new object', function() {
    objects[socket.id] = {
      x: 300,
      y: 300
    };
  });

/*  socket.on('new bullet', function() {
    bullets[socket.id] = {
      x: 300,
      y: 300
    };
  });*/
  
  socket.on('movement', function(data) {
    var object = objects[socket.id] || {};
    if (data.left) {
      object.x -= 5;
    }
    if (data.up) {
      object.y -= 5;
    }
    if (data.right) {
      object.x += 5;
    }
    if (data.down) {
      object.y += 5;
    }
  });

  /*socket.on('bMove', function(data) {
    var bullet = bullets[socket.id] || {};
    if (data.left) {
      bullet.x -= 5;
    }
    if (data.up) {
      bullet.y -= 5;
    }
    if (data.right) {
      bullet.x += 5;
    }
    if (data.down) {
      bullet.y += 5;
    }
  });*/

});

setInterval(function() {
  io.sockets.emit('state', objects); // Inifinite loop
}, 1000 / 60);