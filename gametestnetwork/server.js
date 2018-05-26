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
/*
var listener = io.listen(server);
listener.sockets.on('connection', function(socket){
    socket.emit('message', {'message': socket.id});
});*/

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
var bandages = [];
var bushes = [];
var ammo = [];
var numPlayers = 0;
var treeHealth = 50;

var tree_num = 5;
var bandage_num = 3;
var bush_num = 3;
var ammo_num = 7;

for(i = 0; i < tree_num; i++)
{
  trees[i] = {
    x: Math.random()*1200,
    y: Math.random()*750,
    health: treeHealth
  }
}

for (i = 0; i < ammo_num; i++) {
  ammo[i] = {
    x: Math.random()*1200,
    y: Math.random()*750
  }
}

for (i = 0; i < bandage_num; i++) {
  bandages[i] = {
    x: Math.random() * 1200,
    y: Math.random() * 750,
    isUsed: false
  }
}

for (i = 0; i < bush_num; i++) {
  bushes[i] = {
    x: Math.random() * 1200,
    y: Math.random() * 750,
  }
}

setInterval(function(){ bandage_num++;ammo_num++; }, 3000);

var objects = { // Fields
  bushes, players, bullets, trees, player, health, bandages, ammo
};

var clients = [];

io.on('connection', function(socket) {


  socket.on('storeClientInfo', function (data)
    {
      var clientInfo = new Object();
      clientInfo.customId = data.customId;
      clientInfo.clientId = socket.id;
      clients.push(clientInfo);
    });

  socket.on('disconnect', function (data)
  {
    for( var i=0, len=clients.length; i<len; ++i ){
    var c = clients[i];
    if(c.clientId == socket.id){
      clients.splice(i,1);
      break;
      }
    }
  });
  
  socket.on('new player', function(data) { // event, followed by function performed
    objects.players [socket.id] = {
      x: Math.random() * 1200,
      y: Math.random() * 750,
      health: startHealth,
      isHit: false,
      isHidden: false,
      userId: data,
      id:socket.id,
      ammo: 50
    };
  });

  socket.on('new bullet', function(data)
  {
    var ind = data.length - 1; // data stands in for whatever variable is passed through
    var player = objects.players [socket.id] || {};
    var bExists = false;
    if (!player.isHit && player.ammo > 0) {
      bExists = true;
      player.ammo = player.ammo - 1;
    }
    objects.bullets [ind] = 
    {
      initX: player.x,
      initY: player.y,
      exists: bExists,
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
      if (objects.bullets [i].exists) {
        var dx = objects.bullets [i].xPos - objects.bullets [i].initX;
        var dy = objects.bullets [i].yPos - objects.bullets [i].initY;

        objects.bullets [i].x += (dx * bullet_speed / objects.bullets [i].mag);
        objects.bullets [i].y += (dy * bullet_speed / objects.bullets [i].mag);
        for (var id in objects.players) {
          for (j = 0; j < objects.trees.length; j++) {
            if (objects.bullets[i].exists && objects.bullets[i].x >
              objects.trees[j].x && objects.bullets[i].x < objects.trees[j].x + 100
              && objects.bullets[i].y > objects.trees[j].y && objects.bullets[i].y 
              < objects.trees[j].y + 100 && objects.trees[j].health > 0) {
              objects.bullets[i].exists = false;
              objects.trees[j].health = objects.trees[j].health - 10;
            }
          }
          if (id != objects.bullets[i].playerShot && !objects.players [id].isHit && 
            Math.pow(objects.bullets [i].x - objects.players [id].x, 2) + 
            Math.pow(objects.bullets [i].y - objects.players [id].y, 2) < 400) {
            objects.players [id].health = objects.players [id].health - 10;
            console.log(objects.players [id].health + " " + socket.id);
            objects.bullets[i].exists = false;

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
    for (i = 0; i < objects.bandages.length; i++) {
      bandage = objects.bandages [i];
      if (object.x + 20 >= bandage.x && object.x - 20 <= bandage.x + 30 && object.y + 20 >= bandage.y && object.y - 20 <= bandage.y + 15 && !bandage.isUsed) {
        object.health = object.health + 20;
        bandage.isUsed = true;
      }
    }
    for (i = 0; i < objects.ammo.length; i++) {
      ammo = objects.ammo [i];
      if (object.x + 20 >= ammo.x && object.x - 20 <= ammo.x + 30 && object.y + 20 >= ammo.y && object.y - 20 <= ammo.y + 15 && !ammo.isUsed) {
        object.ammo = object.ammo + 10;
        ammo.isUsed = true;
      }
    }
  });
});

setInterval(function() {
  io.sockets.emit('state', objects); // Infinite loop
}, 1000 / 60);