//testing
var socket = io();
//socket.on('message', function(data) {
//console.log(data);
//});

socket.on('name', function(data)
{
  // data is a parameter containing whatever data was sent
});

var movement =
{
  up: false,
  down: false,
  left: false,
  right: false
}

var shot =
{
  mouseX: 0,
  mouseY: 0
}

function setMousePosition(e) 
{
  shot.mouseX = e.clientX;
  shot.mouseY = e.clientY;
}

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

socket.emit('new player');

setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);



var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
canvas.addEventListener("mousemove", setMousePosition, false);
canvas.addEventListener("mousedown", socket.emit('new bullet'), false);

var context = canvas.getContext('2d');

socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'red';

  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 20, 0, 2 * Math.PI);
    //context.fill();
    context.lineWidth = 3;
    context.strokeStyle = '#FF0000';
    context.stroke();
  }
});

socket.on('state', function(bullets) {

  for (var id in bullets) {
    var bullet = bullets[id];
    context.fillStyle = '#FF0000';
    context.fillRect(bullet.x, bullet.y, 5, 5);
  }
});