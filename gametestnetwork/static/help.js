//testing
var socket = io();
var clientID = create_UUID();
var worldWidth = 5023;
var worldHeight = 5023;

function create_UUID(){ // Cite
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

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

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
};

var mousePos = [];


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

socket.emit('new player', clientID);

setInterval(function() {
  socket.emit('movement', movement);
  socket.emit('updateBullet');
  socket.emit('addAmmo');
}, 1000 / 60);



var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

socket.on('state', function(objects) {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  context.fillStyle = '#86B300';
  var w_dom = true;
  var x_length;
  var y_length;
  var wx_min;
  var wx_max;
  var wy_min;
  var wy_max;
  var margin;

  if (0.55 * canvas.width < canvas.height)
  {
    x_length = canvas.width;
    y_length = 0.55 * canvas.width;
    margin = (canvas.height - y_length) / 2;

    context.fillRect(0, margin, x_length, y_length);
  }

  else
  {
    x_length = canvas.height / 0.55;
    y_length = canvas.height;
    margin = (canvas.width - x_length) / 2;

    context.fillRect(margin, 0, x_length, y_length);
    w_dom = false;
  }

  var tree_image = new Image();
  tree_image.src = '/static/Image_tree.jpeg';


  var bush_image = new Image();
  bush_image.src = '/static/Image_bush.jpeg';

  var bandage_image = new Image();
  bandage_image.src = '/static/Image_bandage.jpeg';

  var ammo_image = new Image();
  ammo_image.src = '/static/Image_ammo.jpeg';

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

          context.drawImage(image, thing.x, thing.y, thing.width, thing.height);
        }
      }
  }

  function regenerative_Elements(elements, image)
  {
    for (i = 0; i < elements.length; i++)
    {
      var thing = elements [i];

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

    if (!player.isHit)
    {
      wx_min = player.realX - x_length/2;
      wx_max = player.realX + x_length/2;
      wy_min = player.realY - y_length/2;
      wy_max = player.realY + y_length/2;

      if (clientID == player.userId)
      {
        for (i = 0; i < objects.trees.length; i++)
        {
          if (objects.trees [i].health <= 0)
          {
            objects.trees [i].isUsed = true;
          }
        }

        regenerative_Elements(objects.trees, tree_image);
        regenerative_Elements(objects.bandages, bandage_image);
        regenerative_Elements(objects.ammo, ammo_image);

        context.beginPath();
        context.lineWidth = 3;
        context.arc(window.innerWidth/2, window.innerHeight/2, 20, 0, 2 * Math.PI);
        context.fillStyle = '#0000FF';
        context.fill();
        //context.stroke();

        /*context.fillStyle = 'white';
        context.font = '50px Arial';
        context.fillText("X: " + wx_min + " - " + wx_max, 10, 50);
        context.fillText("Y: " + wy_min + " - " + wy_max, 10, 100);*/
        
        for (i = 0; i < objects.bullets.length; i++)
        {
          if (objects.bullets [i].exists)
          {
            var bullet = objects.bullets [i];

            if ((bullet.realX + 100 > wx_min) &&
            (bullet.realX < wx_max) &&
            (bullet.realY + 100 > wy_min) &&
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

              context.fillStyle = 'black';              
              context.fillRect(bullet.x, bullet.y, 5, 5);
            }
          }
        }

        var counter = 0;

        for (var id in objects.players)
        {
          var drawing = objects.players [id];
          if (!drawing.isHit)
          {
            if (drawing.userId != clientID)
            {
              var playerXpos;
              var playerYpos;

              if ((drawing.realX + 20 > wx_min) &&
              (drawing.realX - 20 < wx_max) &&
              (drawing.realY + 20 > wy_min) &&
              (drawing.realY - 20 < wy_max))
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
                context.lineWidth = 3;
                context.fillStyle = '#FF0000';
                context.arc(playerXpos, playerYpos, 20, 0, 2 * Math.PI);
                context.fill();
                //context.stroke();
              }
            }
          }
        }

        create_Elements(objects.bushes, bush_image);

        context.fillStyle = '#00CCFF';

        if (w_dom)
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

        var survivors = 0;
        for (var id in objects.players)
        {
          if (!objects.players [id].isHit)
          {
            survivors += 1;
          }
        }

        context.fillStyle = 'black';
        context.font = '30px Arial';
        
        if (w_dom)
        {
          context.fillText("PLAYERS LEFT: " + survivors, 10, margin + 40);
          context.fillText("<" + Math.floor(player.realX) + ", " + (worldHeight - Math.floor(player.realY)) + ">", 10, margin + 80);
          context.fillText("AMMO: " + player.ammo, 10, margin + y_length - 40);
          context.fillText("HEALTH: ", 10, margin + y_length - 10);
        }

        else
        {
          context.fillText("PLAYERS LEFT: " + survivors, margin + 10, 40);
          context.fillText("<" + Math.floor(player.realX) + ", " + (worldHeight - Math.floor(player.realY)) + ">", margin + 10, 80);
          context.fillText("AMMO: " + player.ammo, margin + 10, y_length - 40);
          context.fillText("HEALTH: ", margin + 10, y_length - 10);
        }

        if (player.health <= 30)
        {
          context.fillStyle = 'red';
        }

        else if (player.health <= 70)
        {
          context.fillStyle = 'yellow';
        }

        else if (player.health <= 90)
        {
          context.fillStyle = 'green';
        }

        else
        {
          context.fillStyle = 'blue';
        }

        if (w_dom)
        {
          context.fillRect(140, margin + y_length - 28, 0.005 * player.health * x_length, 20);
        }

        else
        {
          context.fillRect(margin + 140, y_length - 28, 0.005 * player.health * x_length, 20);
        }

        context.fillStyle = 'black';
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