// Adapted/cobbled together from
// https://hackernoon.com/how-to-build-a-multiplayer-browser-game-4a793818c29b
// http://danielnill.com/nodejs-tutorial-with-socketio
// https://www.quora.com/How-do-you-write-HTML-in-a-JavaScript-file
// https://medium.com/@noufel.gouirhate/build-a-simple-chat-app-with-node-js-and-socket-io-ea716c093088
// https://modernweb.com/building-multiplayer-games-with-node-js-and-socket-io/

// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 4000);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
// Starts the server.
server.listen(4000, function() {
  console.log('Starting server on port 4000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
});

// How big the world is
var worldWidth = 4000;
var worldHeight = 4000;

// How many sections the world is divided into along the x and y axes
var x_sector = 8;
var y_sector = 8;

// Self-explanatory variables
var player_speed = 7;
var bullet_speed = 15;
var full_health = 100;
var full_ammo = 50;
var treeHealth = 50;

// Object arrays
var players = {};
var bullets = [];
var trees =[];
var bandages = [];
var bushes = [];
var ammo = [];

// Number of objects in each sector
var tree_num = 5;
var bandage_num = 2;
var bush_num = 3;
var ammo_num = 2;

// More self-explanatory variables
var tree_width = 100;
var tree_height = 100;

var bandage_width = 30;
var bandage_height = 15;

var bush_width = 75;
var bush_height = 75;

var ammo_width = 25;
var ammo_height = 30;

var player_radius = 20;
var player_outline = 3;

// Randomness threshold that dictates how likely
// it is that some object will appear in some section
var randomness_threshold = 0.5;

// Randomness threshold that dictates how often new ammo is liable to appear
var ammo_regen_threshold = 0.001;

var ammo_boost = 10; // Ammo gained from icon
var health_dock = 10; // Health lost after being shot
var health_boost = 20; // Health gained from band-aid

var frame_time = 1000/25; // Time per frame


// Make objects
// Realx and Realy = position on the grid
// x and y are for how things are displayed

// Make trees
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
        width: tree_width,
        height: tree_height,
        health: treeHealth, // How much longer the tree can last
        isUsed: false // Does tree exist
      }
    }
  }
}

// Make bandages
for(i = 0; i < bandage_num; i++)
{
  for (j = 0; j < x_sector; j++)
  {
    for (k = 0; k < y_sector; k++)
    {
      var x_rand = (j + Math.random()) * (worldWidth / x_sector);
      var y_rand = (k + Math.random()) * (worldHeight / y_sector);

      if (Math.random() > randomness_threshold)
      {
        bandages [bandages.length] =
        {
          realX: x_rand,
          realY: y_rand,
          x: x_rand,
          y: y_rand,
          width: bandage_width,
          height: bandage_height,
          isUsed: false
        }
      }
    }
  }
}

// Make bushes
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
        width: bush_width,
        height: bush_height
      }
    }
  }
}

// Make ammo
for(i = 0; i < ammo_num; i++)
{
  for (j = 0; j < x_sector; j++)
  {
    for (k = 0; k < y_sector; k++)
    {
      var x_rand = (j + Math.random()) * (worldWidth / x_sector);
      var y_rand = (k + Math.random()) * (worldHeight / y_sector);

      if (Math.random() > randomness_threshold)
      {
        ammo [ammo.length] =
        {
          realX: x_rand,
          realY: y_rand,
          x: x_rand,
          y: y_rand,
          width: ammo_width,
          height: ammo_height,
          isUsed: false
        }
      }
    }
  }
}

var objects = { // Fields
  players, bullets, trees, bandages, bushes, ammo
};

var clients = []; // Client array

io.on('connection', function(socket) {

  // Method to store socket.id and UUID of each client
  // Adapted from https://stackoverflow.com/questions/7702461/socket-io-custom-client-id
  socket.on('storeClientInfo', function (data)
    {
      var clientInfo = new Object();
      clientInfo.customId = data.customId;
      clientInfo.clientId = socket.id;
      clients.push(clientInfo);
    }); // Add to client array on a new connection
  
  socket.on('new player', function(data) { // Pass in UUID

    // Associate each player with the id of the channel
    // used to communicate b/w server and client
    objects.players [socket.id] = {

      // Spawn in a random position
      realX: Math.random() * worldWidth,
      realY: Math.random() * worldHeight,

      // Max health to start
      health: full_health,

      // Is player dead?
      isHit: false,

      // UUID
      userId: data,

      // Id to use w/ bullet
      id: socket.id,

      // Shots left
      ammo: full_ammo
    };
  });

  // Create bullet
  socket.on('new bullet', function(data)
  {
    var ind = data.length - 1; // index of new bullet in array
    var player = objects.players [socket.id] || {}; // Who shot it

    // Magnitude of bullet vector
    var mag = Math.sqrt(Math.pow(data [ind].xPos, 2) + Math.pow((data [ind].yPos), 2));
    
    // Bullet only exists if player is not dead and has ammo
    var bExists = false;
    if (!player.isHit && player.ammo > 0)
    {
      bExists = true;
      player.ammo = player.ammo - 1; // Reduce ammo
    }

    objects.bullets [ind] = 
    {
      exists: bExists,
      playerShot: player.id, // Player who shot it

      dx: (data [ind].xPos * bullet_speed / mag),
      dy: (data [ind].yPos * bullet_speed / mag),

      // Vectors are used to determine x and y
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

        // If the bullets are not in the world
        if ((objects.bullets [i].realX < 0) ||
            (objects.bullets [i].realX > worldWidth) ||
            (objects.bullets [i].realX < 0) ||
            (objects.bullets [i].realY > worldHeight))
        {
          objects.bullets [i].exists = false; // Unexistify bullet
        }

        // Increment bullet position
        objects.bullets [i].realX += objects.bullets [i].dx;
        objects.bullets [i].realY += objects.bullets [i].dy;

        // Bullet-tree interaction
        for (j = 0; j < objects.trees.length; j++)
        {
          if (objects.trees[j].health > 0 && objects.bullets[i].exists &&
              objects.bullets[i].realX > objects.trees[j].realX &&
              objects.bullets[i].realX < objects.trees[j].realX + objects.trees[j].width &&
              objects.bullets[i].realY > objects.trees[j].realY &&
              objects.bullets[i].realY < objects.trees[j].realY + objects.trees[j].height)
          {
            objects.trees[j].health = objects.trees[j].health - health_dock;
            objects.bullets[i].exists = false;
          }
        }

        // Bullet-player interaction
        for (var id in objects.players)
        {
          if (id != objects.bullets[i].playerShot &&
              !objects.players [id].isHit && 
              Math.pow(objects.bullets [i].realX - objects.players [id].realX, 2) + 
              Math.pow(objects.bullets [i].realY - objects.players [id].realY, 2) <
              Math.pow(player_radius, 2))
          {
            objects.players [id].health = objects.players [id].health - health_dock;
            objects.bullets[i].exists = false;

            if (objects.players [id].health <= 0)
            {
              objects.players [id].isHit = true;
            }
          }
        }
      }
    }
  });
  
  socket.on('movement', function(data) {
    var player = objects.players [socket.id] || {};

    // Move according to WASD keys at a rate of player_speed
    if (data.left) {
      if (player.realX > player_radius + player_outline)
      {
        player.realX -= player_speed;
      }
    }

    if (data.up) {
      if (player.realY > player_radius + player_outline)
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

    // Gain health from bandage
    for (i = 0; i < objects.bandages.length; i++)
    {
      bandage = objects.bandages [i];
      if (player.realX + player_radius >= bandage.realX &&
          player.realX - player_radius <= bandage.realX + bandage.width &&
          player.realY + player_radius >= bandage.realY &&
          player.realY - player_radius <= bandage.realY + bandage.height &&
          player.health < full_health &&
          !bandage.isUsed)
      {
        if (player.health == (full_health - health_dock))
        {
          player.health = full_health;
        }

        else
        {
          player.health = player.health + health_boost;
        }

        bandage.isUsed = true;
      }
    }

    // Gain ammo from icons
    for (i = 0; i < objects.ammo.length; i++)
    {
      ammo = objects.ammo [i];
      if (player.realX + player_radius >= ammo.realX &&
          player.realX - player_radius <= ammo.realX + ammo.width &&
          player.realY + player_radius >= ammo.realY &&
          player.realY - player_radius <= ammo.realY + ammo.height &&
          !ammo.isUsed)
      {
        player.ammo = player.ammo + ammo_boost;
        ammo.isUsed = true;
      }
    }
  });
  
  // Randomly regenerate ammo icons about once every minute
  socket.on('addAmmo', function(){
    if (Math.random() < ammo_regen_threshold)
    {
      var x_rand = Math.random()*worldWidth;
      var y_rand = Math.random()*worldHeight;
      ammo [ammo.length] =
      {
        realX: x_rand,
        realY: y_rand,
        x: x_rand,
        y: y_rand,
        width: ammo_width,
        height: ammo_height,
        isUsed: false
      }
    }
  });
});

setInterval(function() {
  io.sockets.emit('state', objects); // Infinite loop
}, frame_time);