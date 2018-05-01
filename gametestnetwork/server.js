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

var bullet_speed = 5; // Magic #
var players = {}; // Player object
var bullets = []; // Bullet array
var trees = []; // Tree array

var tree_num = 5;

for (i =0; i < tree_num; i++)
{
  trees [i] = {
    x: 
    y: 
  };
}

var objects = { // Fields
  players, bullets, trees
};

io.on('connection', function(socket) {
  
  socket.on('new player', function() { // event, followed by function performed
    objects.players [socket.id] = {
      x: 300,
      y: 300
    };
  });

  socket.on('new bullet', function(data)
  {
    var ind = data.length - 1; // data stands in for whatever variable is passed through
    var player = objects.players [socket.id] || {}; // asscoaite with a player
    objects.bullets [ind] = 
    {
      initX: player.x, // initial position
      initY: player.y,
      xPos: data [ind].xPos, // mouse click
      yPos: data [ind].yPos,
      mag: Math.sqrt(Math.pow((data [ind].xPos - player.x), 2) +
      Math.pow((data [ind].yPos - player.y), 2)), // vector magnitude

      x: player.x, // current position
      y: player.y
    };
  });

  socket.on('updateBullet', function(data)
  {
    for (i = 0; i < objects.bullets.length; i++)
    {
      var dx = objects.bullets [i].xPos - objects.bullets [i].initX;
      var dy = objects.bullets [i].yPos - objects.bullets [i].initY;

      objects.bullets [i].x += (dx * bullet_speed / objects.bullets [i].mag);
      objects.bullets [i].y += (dy * bullet_speed / objects.bullets [i].mag);
    }
  });
  
  socket.on('movement', function(data) {
    var object = objects.players [socket.id] || {};
    if (data.left) {
      object.x -= 5;
      console.log("#");
      console.log(socket.id);
    }
    if (data.up) {
      object.y -= 5;
    }
    if (data.right) {
      object.x += 5;
      console.log("?");
      console.log(socket.id);
    }
    if (data.down) {
      object.y += 5;
    }
  });
});

setInterval(function() {
  io.sockets.emit('state', objects); // Inifinite loop
}, 1000 / 60);