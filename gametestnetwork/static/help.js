//testing
var socket = io();
//socket.on('message', function(data) {
//console.log(data);
//});

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

socket.emit('new player');

setInterval(function() {
  socket.emit('movement', movement);
  socket.emit('updateBullet', mousePos);
}, 1000 / 60);



var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;

var context = canvas.getContext('2d');

socket.on('state', function(objects) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'red';
  
  var tree_image = new Image();
  tree_image.src = '/static/Image_tree.jpeg';

  for (i = 0; i < objects.trees.length; i++)
  {
    var object = objects.trees [i];
    context.drawImage(tree_image, object.x, object.y, 100, 100);
  }

  for (var id in objects.players) {
    var object = objects.players [id];

    context.beginPath();
    context.arc(object.x, object.y, 20, 0, 2 * Math.PI);
    //context.fill();
    context.lineWidth = 3;
    context.strokeStyle = '#FF0000';
    context.stroke();
  }

  for (var id in objects.bullets) {
    var object = objects.bullets [id];
    context.fillRect(object.x, object.y, 5, 5);
  }

});