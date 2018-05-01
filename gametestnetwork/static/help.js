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

var mousePos = {};

/*var bMovement = {
  up: false,
  down: false,
  left: false,
  right: false
}*/

//var bulletRoster[];
/*document.addEventListener('click', function(event) {
  mousePos [mousePos.length] = {
    xClick = event.clientX;
    yClick = event.clientY;
  }
});*/

document.addEventListener("mousedown", function(event){
  mousePos [mousePos.length] =
  {
    xPos: event.x,
    yPos: event.y
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
//socket.emit('new bullet');


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
  context.fillStyle = 'blue';
  
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