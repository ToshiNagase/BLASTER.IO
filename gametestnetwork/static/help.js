//testing
var socket = io();
var clientID = create_UUID();
//socket.on('message', function(data) {
//console.log(data);
//});

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

//var socket = io.connect();



var movement = {
  up: false,
  down: false,
  left: false,
  right: false
};



var mousePos = [];
var playerID;

/*socket.on('message', function(data){
    console.log(data.message);
    playerID = data.message;
});*/

document.addEventListener("mousedown", function(event){
  mousePos [mousePos.length] =
  {
    xPos: event.clientX,
    yPos: event.clientY
  }

  socket.emit('new bullet', mousePos);
});


document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      //bMovement.left = true;
      break;
    case 87: // W
      movement.up = true;
      //bMovement.up = true;
      break;
    case 68: // D
      movement.right = true;
      //bMovement.right = true;
      break;
    case 83: // S
      movement.down = true;
      //bMovement.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      //bMovement.left = false;
      break;
    case 87: // W
      movement.up = false;
      //bMovement.up = false;
      break;
    case 68: // D
      movement.right = false;
      //bMovement.right = false;
      break;
    case 83: // S
      movement.down = false;
      //bMovement.down = false;
      break;
  }
});

socket.emit('new player', clientID);

setInterval(function() {
  socket.emit('movement', movement);
  socket.emit('updateBullet', mousePos);
  socket.emit('set health');
}, 1000 / 60);



var canvas = document.getElementById('canvas');


var context = canvas.getContext('2d');

socket.on('state', function(objects) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context.fillStyle = 'black';

  var tree_image = new Image();
  tree_image.src = '/static/Image_tree.jpeg';

  var bandage_image = new Image();
  bandage_image.src = '/static/Image_bandage.jpeg';

  var bush_image = new Image();
  bush_image.src = '/static/Image_bush.jpeg';


  for (i = 0; i < objects.trees.length; i++)
  {
    if (objects.trees[i].health > 0) {
      var object = objects.trees [i];
      context.drawImage(tree_image, object.x, object.y, 100, 100);
    }
  }
  for (j = 0; j < objects.bandages.length; j++) {
    var object = objects.bandages [j];
    if (!object.isUsed) {
      context.drawImage(bandage_image, object.x, object.y, 30, 15);
    }
  }

  

  context.fillStyle = 'black';
  context.font = '50px Arial';
  //console.log("WORKS");
  for (var id in objects.players) {
    var object = objects.players [id];
    if (!objects.players [id].isHit) {
      context.beginPath();
      context.arc(object.x, object.y, 20, 0, 2 * Math.PI);
      context.lineWidth = 3;

      if (clientID == object.userId)
      {
        context.strokeStyle = '#0000FF';
        context.fillText("Health: ", 10, 50);
        context.fillText("Ammo: " + object.ammo, 10,100);
        if (object.health <= 30) {
          context.fillStyle = 'red';
        }
        else if (object.health < 70) {
          context.fillStyle = 'yellow';
        }
        else {
          context.fillStyle = 'green';
        }
        context.fillRect(170,27, 5*object.health,20);
      }
      else
      {
        context.strokeStyle = '#FF0000';
      }
      context.fillStyle = 'black';
      context.stroke();
    }
  }
  

  for (i = 0; i < objects.bushes.length; i++) {
    var object = objects.bushes [i];
    context.drawImage(bush_image, object.x, object.y, 100,100);
  }

  for (var id in objects.bullets) {
    if (objects.bullets [id].exists) {
      var object = objects.bullets [id];
      context.fillRect(object.x, object.y, 5, 5);
    }
  }

});