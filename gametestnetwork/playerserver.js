//var exports = module.exports{}
/*playerServer: function()
{
  var players = {};
  io.on('connection', function(socket) {
    socket.on('new player', function() {
      players[socket.id] = {
        x: 300,
        y: 300
      };
    });
    
    socket.on('movement', function(data) {
      var player = players[socket.id] || {};
      if (data.left) {
        player.x -= 5;
      }
      if (data.up) {
        player.y -= 5;
      }
      if (data.right) {
        player.x += 5;
      }
      if (data.down) {
        player.y += 5;
      }
    });
  });
}
}*/

exports.newPlayer = function(value, players)
{
  players[value] = {
    x: 300,
    y: 300
  };
};

//module.exports = 
exports.playerMove = function(data, players)
{
  var player = players[socket.id] || {};
      if (data.left) {
        player.x -= 5;
      }
      if (data.up) {
        player.y -= 5;
      }
      if (data.right) {
        player.x += 5;
      }
      if (data.down) {
        player.y += 5;
      }
};

//exports.data = methods;