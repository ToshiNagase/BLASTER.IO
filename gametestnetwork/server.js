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

var listener = io.listen(server);
listener.sockets.on('connection', function(socket){
    socket.emit('message', {'message': socket.id});
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
});

var player_speed = 4;
var startHealth = 100;
var bullet_speed = 5; // Magic #
var players = {}; // Player object
var bullets = []; // Bullet array
var player = 0;
var health = startHealth;
var trees =[];
var numPlayers = 0;

var tree_num = 5;

for(i = 0; i < tree_num; i++)
{
  trees[i] = {
    x: Math.random()*1200,
    y: Math.random()*750
  }
}

var objects = { // Fields
  players, bullets, trees, player, health
};


io.on('connection', function(socket) {
  
  socket.on('new player', function() { // event, followed by function performed
    objects.players [socket.id] = {
      x: 300,
      y: 300,
      health: startHealth,
      isHit: false,
      id:socket.id
    };
    objects.player = socket.id;
  });

  socket.on('new bullet', function(data)
  {
    var ind = data.length - 1; // data stands in for whatever variable is passed through
    var player = objects.players [socket.id] || {};
    /*console.log("#HELP");
    console.log(ind);*/
    objects.bullets [ind] = 
    {
      initX: player.x,
      initY: player.y,
      exists: !player.isHit,
      playerShot: player.id,
      xPos: data [ind].xPos,
      yPos: data [ind].yPos,
      mag: Math.sqrt(Math.pow((data [ind].xPos - player.x), 2) +
      Math.pow((data [ind].yPos - player.y), 2)),

      x: player.x,
      y: player.y
    };
  });


  socket.on('updateBullet', function(data)
  {
    for (i = 0; i < objects.bullets.length; i++)
    {
     /* console.log("#WE TRIED");
      console.log(objects.bullets.length);
      console.log(data.length);
      console.log(i);*/
      if (objects.bullets [i].exists) {
        var dx = objects.bullets [i].xPos - objects.bullets [i].initX;
        var dy = objects.bullets [i].yPos - objects.bullets [i].initY;

        objects.bullets [i].x += (dx * bullet_speed / objects.bullets [i].mag);
        objects.bullets [i].y += (dy * bullet_speed / objects.bullets [i].mag);
        for (var id in objects.players) {
          for (j = 0; j < objects.trees.length; j++) {
            if (objects.bullets[i].exists && objects.bullets[i].x > objects.trees[j].x && objects.bullets[i].x < objects.trees[j].x + 100
              && objects.bullets[i].y > objects.trees[j].y && objects.bullets[i].y < objects.trees[j].y + 100) {
              objects.bullets[i].exists = false;

            }
          }
          if (id != objects.bullets[i].playerShot && !objects.players [id].isHit && 
            Math.pow(objects.bullets [i].x - objects.players [id].x,2) + Math.pow(objects.bullets [i].y - objects.players [id].y,2) < 400) {
            objects.players [id].health = objects.players [id].health - 10;
            console.log(objects.players [id].health + " " + socket.id);
            objects.bullets[i].exists = false;
            //console.log(id);
            if (objects.players [id].health <= 0) {
              objects.players [id].isHit = true;
            }
          }
        }
      }
    }
    var player = objects.players [socket.id] || {};
    objects.health = player.health;
  });
  
  socket.on('movement', function(data) {
    var object = objects.players [socket.id] || {};
    if (data.left) {
      object.x -= player_speed;
      //console.log("#");
      //console.log(socket.id);
    }
    if (data.up) {
      object.y -= player_speed;
    }
    if (data.right) {
      object.x += player_speed;
      //console.log("?");
      //console.log(socket.id);
    }
    if (data.down) {
      object.y += player_speed;
    }
  });
});

setInterval(function() {
  io.sockets.emit('state', objects); // Inifinite loop
}, 1000 / 60);