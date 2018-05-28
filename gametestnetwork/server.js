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

var worldWidth = 5000;
var worldHeight = 5000;
var x_sector = 8;
var y_sector = 8;

var player_speed = 4;
var startHealth = 100;
var bullet_speed = 15;
var full_ammo = 50;
var treeHealth = 50;

var players = {}; // Player object

var bullets = []; // Bullet array

var trees =[];
var tree_num = 5;

var bandages = [];
var bandage_num = 2;

var bushes = [];
var bush_num = 3;

var ammo = [];
var ammo_num = 2;

for(i = 0; i < tree_num; i++)
{
  for (j = 0; j < x_sector; j++)
  {
    for (k = 0; k < y_sector; k++)
    {
      var x_rand = (j + Math.random()) * (worldWidth / x_sector);
      var y_rand = (k + Math.random()) * (worldHeight / y_sector);

      trees [trees.length] =
      {
        realX: x_rand,
        realY: y_rand,
        x: x_rand,
        y: y_rand,
        width: 100,
        height: 100,
        health: treeHealth,
        isUsed: false
      }
    }
  }
}

for(i = 0; i < bandage_num; i++)
{
  for (j = 0; j < x_sector; j++)
  {
    for (k = 0; k < y_sector; k++)
    {
      var x_rand = (j + Math.random()) * (worldWidth / x_sector);
      var y_rand = (k + Math.random()) * (worldHeight / y_sector);

      if (Math.random() > 0.5)
      {
        bandages [bandages.length] =
        {
          realX: x_rand,
          realY: y_rand,
          x: x_rand,
          y: y_rand,
          width: 30,
          height: 15,
          isUsed: false
        }
      }
    }
  }
}

for(i = 0; i < bush_num; i++)
{
  for (j = 0; j < x_sector; j++)
  {
    for (k = 0; k < y_sector; k++)
    {
      var x_rand = (j + Math.random()) * (worldWidth / x_sector);
      var y_rand = (k + Math.random()) * (worldHeight / y_sector);

      bushes [bushes.length] =
      {
        realX: x_rand,
        realY: y_rand,
        x: x_rand,
        y: y_rand,
        width: 75,
        height: 75
      }
    }
  }
}

for(i = 0; i < ammo_num; i++)
{
  for (j = 0; j < x_sector; j++)
  {
    for (k = 0; k < y_sector; k++)
    {
      var x_rand = (j + Math.random()) * (worldWidth / x_sector);
      var y_rand = (k + Math.random()) * (worldHeight / y_sector);

      if (Math.random() > 0.5)
      {
        ammo [ammo.length] =
        {
        realX: x_rand,
        realY: y_rand,
        x: x_rand,
        y: y_rand,
        width: 25,
        height: 30,
        isUsed: false
        }
      }
    }
  }
}

var objects = { // Fields
  players, bullets, trees, bandages, bushes, ammo
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
      realX: Math.random() * worldWidth,
      realY: Math.random() * worldHeight,
      health: startHealth,
      isHit: false,
      isHidden: false,
      userId: data,
      id: socket.id,
      ammo: full_ammo
    };
  });

  socket.on('new bullet', function(data)
  {
    var ind = data.length - 1; // data stands in for whatever variable is passed through
    var player = objects.players [socket.id] || {};
    var mag = Math.sqrt(Math.pow(data [ind].xPos, 2) + Math.pow((data [ind].yPos), 2));
    var bExists = false;

    if (!player.isHit && player.ammo > 0)
    {
      bExists = true;
      player.ammo = player.ammo - 1;
    }

    objects.bullets [ind] = 
    {
      exists: bExists,
      playerShot: player.id,
      dx: (data [ind].xPos * bullet_speed / mag),
      dy: (data [ind].yPos * bullet_speed / mag),
      x: data [ind].userX,
      y: data [ind].userY,
      realX: player.realX,
      realY: player.realY
    };
  });


  socket.on('updateBullet', function()
  {
    for (i = 0; i < objects.bullets.length; i++)
    {
      if (objects.bullets [i].exists) {

        if ((objects.bullets [i].realX < 0) ||
            (objects.bullets [i].realX > worldWidth) ||
            (objects.bullets [i].realX < 0) ||
            (objects.bullets [i].realY > worldHeight))
        {
          objects.bullets [i].exists = false;
        }
        
        objects.bullets [i].realX += objects.bullets [i].dx;
        objects.bullets [i].realY += objects.bullets [i].dy;

        for (var id in objects.players)
        {
          for (j = 0; j < objects.trees.length; j++)
          {
            if (objects.trees[j].health > 0 && objects.bullets[i].exists &&
                objects.bullets[i].realX > objects.trees[j].realX &&
                objects.bullets[i].realX < objects.trees[j].realX + objects.trees[j].width &&
                objects.bullets[i].realY > objects.trees[j].realY &&
                objects.bullets[i].realY < objects.trees[j].realY + objects.trees[j].height)
            {
              objects.trees[j].health = objects.trees[j].health - 10;
              objects.bullets[i].exists = false;
            }
          }

          if (id != objects.bullets[i].playerShot &&
              !objects.players [id].isHit && 
              Math.pow(objects.bullets [i].realX - objects.players [id].realX, 2) + 
              Math.pow(objects.bullets [i].realY - objects.players [id].realY, 2) < 400)
          {
            objects.players [id].health = objects.players [id].health - 10;
            objects.bullets[i].exists = false;

            if (objects.players [id].health <= 0)
            {
              objects.players [id].isHit = true;
            }
          }
        }
      }
    }

    var player = objects.players [socket.id] || {};
  });
  
  socket.on('movement', function(data) {
    var player = objects.players [socket.id] || {};
    if (data.left) {
      if (player.realX > 23)
      {
        player.realX -= player_speed;
      }
    }

    if (data.up) {
      if (player.realY > 23)
      {
        player.realY -= player_speed;
      }
    }

    if (data.right) {
      if (player.realX < worldWidth)
      {
        player.realX += player_speed;
      }
    }

    if (data.down) {
      if (player.realY < worldHeight)
      {
        player.realY += player_speed;
      }
    }

    for (i = 0; i < objects.bandages.length; i++)
    {
      bandage = objects.bandages [i];
      if (player.realX + 20 >= bandage.realX &&
          player.realX - 20 <= bandage.realX + bandage.width &&
          player.realY + 20 >= bandage.realY &&
          player.realY - 20 <= bandage.realY + bandage.height &&
          player.health < 100 &&
          !bandage.isUsed)
      {
        if (player.helth == 90)
        {
          player.health = 100;
        }

        else
        {
          player.health = player.health + 20;
        }

        bandage.isUsed = true;
      }
    }

    for (i = 0; i < objects.ammo.length; i++)
    {
      ammo = objects.ammo [i];
      if (player.realX + 20 >= ammo.realX &&
          player.realX - 20 <= ammo.realX + ammo.width &&
          player.realY + 20 >= ammo.realY &&
          player.realY - 20 <= ammo.realY + ammo.height &&
          !ammo.isUsed)
      {
        player.ammo = player.ammo + 10;
        ammo.isUsed = true;
      }
    }
  });

  socket.on('addAmmo', function(){
    if (Math.random() < 0.001)
    {
      var x_rand = Math.random()*worldWidth;
      var y_rand = Math.random()*worldHeight;
      ammo [ammo.length] =
      {
        realX: x_rand,
        realY: y_rand,
        x: x_rand,
        y: y_rand,
        width: 25,
        height: 30,
        isUsed: false
      }
    }
  });
});

setInterval(function() {
  io.sockets.emit('state', objects); // Infinite loop
}, 1000/50);