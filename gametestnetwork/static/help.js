// Adapted/cobbled together from
// https://hackernoon.com/how-to-build-a-multiplayer-browser-game-4a793818c29b
// http://danielnill.com/nodejs-tutorial-with-socketio
// https://www.quora.com/How-do-you-write-HTML-in-a-JavaScript-file
// https://medium.com/@noufel.gouirhate/build-a-simple-chat-app-with-node-js-and-socket-io-ea716c093088
// https://modernweb.com/building-multiplayer-games-with-node-js-and-socket-io/
// https://www.w3schools.com/colors/colors_picker.asp

var socket = io();

// Unique client ID
var clientID = create_UUID();

// Sizing variables
var player_radius = 20;
var player_outline = 3;

var bullet_width = 5;
var bullet_height = 5;

var worldWidth = 4000 + player_radius + player_outline;
var worldHeight = 4000 + player_radius + player_outline;

var frame_time = 1000/25; // Time per frame
var refresh_thresold = 30; // How often to check the new window size

// Self-explanatory
var grass_color = '#86B300';
var player_color = '#FAD7A0';
var bullet_color = 'black';
var enemy_color = 'red';
var ocean_color = '#00CCFF'; // Don't question it

// For the health bar
var low_health_color = 'red';
var med_health_color = 'yellow';
var high_health_color = 'green';
var full_health_color = 'blue';

// For the text
var text_color = 'black';
var font_size = 30;
var font_type = '30px Arial';
var text_buffer = 10;

// Variables for scaling
var canvas_ratio = 0.55;
var bullet_range = 100;

// Also for the health bar

var low_health = 30;
var med_health = 70;
var high_health = 90;

var label_length = 140;
var health_bar_height = 20;
var health_buffer = 8;
var health_length_constant = 0.005;

// Because it makes sense
var margin_color = 'black';

// Copied from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

// Adpated from https://stackoverflow.com/questions/7702461/socket-io-custom-client-id
socket.on('connect', function (data)
{
  socket.emit('storeClientInfo',
    { 
      customId: clientID
    });
});

socket.on('name', function(data) {
  // data is a parameter containing whatever data was sent
});

// Should it be moving in a given direction? variable
var movement = {
  up: false,
  down: false,
  left: false,
  right: false
};

var mousePos = []; // Mouse clicks array

// Add a new bullet that travel in the direction of the mouse click relative to the player
document.addEventListener("mousedown", function(event){
  mousePos [mousePos.length] =
  {
    xPos: event.clientX - window.innerWidth/2,
    yPos: event.clientY - window.innerHeight/2,
    userX: window.innerWidth/2,
    userY: window.innerHeight/2
  }

  socket.emit('new bullet', mousePos);

});

// Move inituitively according to WASD
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;

    case 87: // W
      movement.up = true;
      break;

    case 68: // D
      movement.right = true;
      break;

    case 83: // S
      movement.down = true;
      break;
  }
});

// Stop moving in a direction once a key is no longer pressed
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;

    case 87: // W
      movement.up = false;
      break;

    case 68: // D
      movement.right = false;
      break;

    case 83: // S
      movement.down = false;
      break;
  }
});

// Each client has a new player associated with it
socket.emit('new player', clientID);

// Update game according to frame_time
setInterval(function() {
  socket.emit('movement', movement);
  socket.emit('updateBullet');
  socket.emit('addAmmo');
}, frame_time);


// Create canvas
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

  var tree_image = new Image();
  tree_image.src = '/static/Image_tree.jpeg';
  
  var bush_image = new Image();
  bush_image.src = '/static/Image_bush.jpeg';

  var bandage_image = new Image();
  bandage_image.src = '/static/Image_bandage.jpeg';

  var ammo_image = new Image();
  ammo_image.src = '/static/Image_ammo.jpeg';

  var refreshRate = 0;
  // the refreshRate for setting canvas.width and height

socket.on('state', function(objects) {

  refreshRate = (refreshRate + 1) % refresh_thresold;
  if (refreshRate == 0)
  {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  context.fillStyle = grass_color;
  var w_dom = true; // Does the width dominate the height
  var x_length; // x-length of game
  var y_length; // y-length of game
  var wx_min; // Game x-min
  var wx_max; // Game x-max
  var wy_min; // Game y-min
  var wy_max; // Game y-max
  var margin; // margin length

  // Check ratios
  if (canvas_ratio * canvas.width < canvas.height)
  {
    x_length = canvas.width;
    y_length = canvas_ratio * canvas.width;
    margin = (canvas.height - y_length) / 2;

    context.fillRect(0, margin, x_length, y_length);
  }

  else
  {
    x_length = canvas.height / canvas_ratio;
    y_length = canvas.height;
    margin = (canvas.width - x_length) / 2;

    context.fillRect(margin, 0, x_length, y_length);
    w_dom = false;
  }

  /*
    Currently only used for bush, but this method is intended to make
    it easy to create any object that can't be eliminated from the game
  */
  function create_Elements(elements, image)
  {
    for (i = 0; i < elements.length; i++)
    {
      var thing = elements [i];

      if ((thing.realX + thing.width > wx_min) &&
        (thing.realX < wx_max) &&
        (thing.realY + thing.height > wy_min) &&
        (thing.realY < wy_max))
        {
          if (w_dom)
          {
            thing.x = thing.realX - wx_min;
            thing.y = thing.realY - wy_min + margin;
          }

          else
          {
            thing.x = thing.realX - wx_min + margin;
            thing.y = thing.realY - wy_min;
          }

          // Draw where specified
          context.drawImage(image, thing.x, thing.y, thing.width, thing.height);
        }
      }
  }

  /*
    Currently used for trees, ammo and bandages.
    This method checks if an object is still in
    the game and creates it as necessary.
  */
  function regenerative_Elements(elements, image)
  {
    for (i = 0; i < elements.length; i++)
    {
      var thing = elements [i];
      // Note: Thing, element, and object are all used
      // because this needs to work for multiple stuffs

      if (!thing.isUsed)
      {
        if ((thing.realX + thing.width > wx_min) &&
          (thing.realX < wx_max) &&
          (thing.realY + thing.height > wy_min) &&
          (thing.realY < wy_max))
          {
            if (w_dom)
            {
              thing.x = thing.realX - wx_min;
              thing.y = thing.realY - wy_min + margin;
            }

            else
            {
              thing.x = thing.realX - wx_min + margin;
              thing.y = thing.realY - wy_min;
            }

            context.drawImage(image, thing.x, thing.y, thing.width, thing.height);
          }
      }
    }
  }


  for (var id in objects.players)
  {
    var player = objects.players [id];

    
    if(player.isHit && clientID == player.userId)
    {
      window.location.href = "/static/HtmlPages/deathPage.html";
      id = objects.players.length; //exit for loop to prevent lag
    }

    else
    {
      wx_min = player.realX - x_length/2;
      wx_max = player.realX + x_length/2;
      wy_min = player.realY - y_length/2;
      wy_max = player.realY + y_length/2;

      if (clientID == player.userId) // Draw stuff only from player's perspective
      {
        // Check if trees are alive
        for (i = 0; i < objects.trees.length; i++)
        {
          if (objects.trees [i].health <= 0)
          {
            objects.trees [i].isUsed = true;
          }
        }

        // Generate trees, ammo and bandages
        regenerative_Elements(objects.trees, tree_image);
        regenerative_Elements(objects.bandages, bandage_image);
        regenerative_Elements(objects.ammo, ammo_image);

        // Generate player
        context.beginPath();
        context.lineWidth = player_outline;
        context.arc(window.innerWidth/2, window.innerHeight/2, player_radius, 0, 2 * Math.PI);
        context.fillStyle = player_color;
        context.fill();
        
        // Make bullets
        for (i = 0; i < objects.bullets.length; i++)
        {
          if (objects.bullets [i].exists)
          {
            var bullet = objects.bullets [i];

            if ((bullet.realX + bullet_range > wx_min) &&
            (bullet.realX < wx_max) &&
            (bullet.realY + bullet_range > wy_min) &&
            (bullet.realY < wy_max))
            {
              if (w_dom)
              {
                bullet.x = bullet.realX - wx_min;
                bullet.y = bullet.realY - wy_min + margin;
              }

              else
              {
                bullet.x = bullet.realX - wx_min + margin;
                bullet.y = bullet.realY - wy_min;
              }

              context.fillStyle = bullet_color;              
              context.fillRect(bullet.x, bullet.y, bullet_width, bullet_height);
            }
          }
        }

        // Draw other players with a different color
        for (var id in objects.players)
        {
          var drawing = objects.players [id];
          if (!drawing.isHit)
          {
            if (drawing.userId != clientID)
            {
              var playerXpos;
              var playerYpos;

              if ((drawing.realX + player_radius > wx_min) &&
              (drawing.realX - player_radius < wx_max) &&
              (drawing.realY + player_radius > wy_min) &&
              (drawing.realY - player_radius < wy_max))
              {
                if (w_dom)
                {
                  playerXpos = drawing.realX - wx_min;
                  playerYpos = drawing.realY - wy_min + margin;
                }

                else
                {
                  playerXpos = drawing.realX - wx_min + margin;
                  playerYpos = drawing.realY - wy_min;
                }

                context.beginPath();
                context.lineWidth = player_outline;
                context.fillStyle = enemy_color;
                context.arc(playerXpos, playerYpos, player_radius, 0, 2 * Math.PI);
                context.fill();
              }
            }
          }
        }

        // Bushes cover everything by design
        create_Elements(objects.bushes, bush_image);

        context.fillStyle = ocean_color;
        // Player can't walk into ocean b/c we
        // needed borders and that makes sense

        // Add ocean borders
        if (w_dom) // Width dominating height will largely affect borders
        {
          if (player.realX - (x_length / 2) <= 0)
          {
            context.fillRect(0, margin, (x_length / 2) - player.realX, y_length);
          }

          if (player.realX + (x_length / 2) >= worldWidth)
          {
            context.fillRect((x_length/2) + worldWidth - player.realX,
            margin, (x_length / 2) - worldWidth + player.realX, y_length);
          }

          if (player.realY - (y_length / 2) <= 0)
          {
            context.fillRect(0, margin, x_length, (y_length/2) - player.realY);
          }

          if (player.realY + (y_length / 2) >= worldHeight)
          {
            context.fillRect(0, margin + (y_length / 2) + worldHeight - player.realY,
            x_length, (y_length / 2) - worldHeight + player.realY);
          }
        }

        else
        {
          if (player.realX - (x_length / 2) <= 0)
          {
            context.fillRect(margin, 0, (x_length/2) - player.realX, y_length);
          }

          if (player.realX + (x_length / 2) >= worldWidth)
          {
            context.fillRect(margin + (x_length/2) + worldWidth - player.realX, 0,
            (x_length / 2) - worldWidth + player.realX, y_length);
          }

          if (player.realY - (y_length / 2) <= 0)
          {
            context.fillRect(margin, 0, x_length, (y_length / 2) - player.realY);
          }

          if (player.realY + (y_length / 2) >= worldHeight)
          {
            context.fillRect(margin, (y_length/2) + worldHeight - player.realY,
            x_length, (y_length/2) - worldHeight + player.realY);
          }

        }

        // Number of players left
        var survivors = 0;
        for (var id in objects.players)
        {
          if (!objects.players [id].isHit)
          {
            survivors += 1;
          }
        }

        context.fillStyle = text_color;
        context.font = font_type;
        
        // Add text to let the player know what's happening
        if (w_dom)
        {
          context.fillText("PLAYERS LEFT: " + survivors,
          text_buffer, margin + font_size + text_buffer);

          context.fillText("<" + Math.floor(player.realX) + ", " +
          (worldHeight - Math.floor(player.realY)) + ">", text_buffer,
          margin + 2*(font_size + text_buffer));

          context.fillText("AMMO: " + player.ammo, text_buffer,
          margin + y_length - (font_size + text_buffer));

          context.fillText("HEALTH: ", text_buffer, margin + y_length - text_buffer);
        }

        else
        {
          context.fillText("PLAYERS LEFT: " + survivors,
          margin + text_buffer, (font_size + text_buffer));

          context.fillText("<" + Math.floor(player.realX) + ", " +
          (worldHeight - Math.floor(player.realY)) + ">", margin +
          text_buffer, 2*(font_size + text_buffer));

          context.fillText("AMMO: " + player.ammo,
          margin + text_buffer, y_length - (font_size + text_buffer));

          context.fillText("HEALTH: ", margin + text_buffer, y_length - text_buffer);
        }

        // Health bar color changes
        if (player.health <= low_health)
        {
          context.fillStyle = low_health_color;
        }

        else if (player.health <= med_health)
        {
          context.fillStyle = med_health_color;
        }

        else if (player.health <= high_health)
        {
          context.fillStyle = high_health_color;
        }

        else
        {
          context.fillStyle = full_health_color;
        }

        // Create margins
        if (w_dom)
        {
          context.fillRect(label_length, margin + y_length - health_bar_height - health_buffer,
          health_length_constant * player.health * x_length, health_bar_height);
        }

        else
        {
          context.fillRect(margin + label_length, y_length - health_bar_height - health_buffer,
          health_length_constant * player.health * x_length, health_bar_height);
        }

        context.fillStyle = margin_color;
        if (w_dom)
        {
          context.fillRect(0, 0, canvas.width, margin);
          context.fillRect(0, margin + y_length, canvas.width, margin);
        }

        else
        {
          context.fillRect(0, 0, margin, canvas.height);
          context.fillRect(margin + x_length, 0, margin, canvas.height);
        }

      }
    }
  }
});