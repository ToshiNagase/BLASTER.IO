//var playerHasBeenHit = false;    
var playerID = 0;

    function player(id, color, size, x, y, speed) {
        this.id = id;
        this.color = color;
        this.size = size;
        this.x = width / 2;
        this.mapX = x;
        this.mapY = y;
        this.y = height / 2;
        this.speed = speed;
        this.playerHasBeenHit = false;
    }
    var playerRoster = [];

    function addPlayer(color, size, x, y,speed) {
        playerRoster[playerID] = new player(playerID, color, size, x, y,speed);
        playerID += 1;
    }

    function updatePlayer(player)
    {
        // Latest code
        if(up){
            player.y -= 8;
            up = false;
        }
        if(down){
            player.y += 8;
            down = false;
        }
        if(left){
            player.x -= 8;
            left = false;
        }
        if(right){
            player.x += 8;
            right = false;
        }

    }

    function playerCheckIsHit(eb, currentPlayer) {
        if (Math.sqrt((currentPlayer.x - eb.xPos)*(currentPlayer.x - eb.xPos)+
            (currentPlayer.y - eb.yPos)*(currentPlayer.y - eb.yPos)) *2 / 3<= currentPlayer.size)
            {
                if (!currentPlayer.playerHasBeenHit && !eb.hasHit) {
                     //clearBullet();
                     currentPlayer.playerHasBeenHit = true;
                     //ebRoster.splice(bullet.bulletID, 1);
                     eb.hasHit = true;
                     document.write("you dead");
                }
            }
    }

    function clearPlayer()
    {        
        playerRoster.forEach(function(currentPlayer)
        {
            var canvas = document.getElementById('blaster');
            if (!canvas.getContext) return;
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        });
    }

    function drawPlayer()
    {
    //    $.each(playerRoster, function (index, currentPlayer)
        playerRoster.forEach( function (currentPlayer)
        {
            //DrawX = currentPlayer.x;
            //DrawY = currentPlayer.y;
            updatePlayer(playerRoster[0]);
            //rectWidth = currentPlayer.size;
            //rectHeight = currentPlayer.size;
            var canvas = document.getElementById('blaster');
            if (!canvas.getContext) return;
            var ctx = canvas.getContext('2d');
            //ctx.fillStyle = currentPlayer.color;
            //ctx.fillRect(DrawX, DrawY, rectWidth, rectHeight);

            //ctx.fillText("id: " + currentPlayer.id, DrawX, DrawY);
            //ctx.fillText("speed: " + currentPlayer.speed, DrawX, DrawY - 20);
            //ctx.fillText("x: " + currentPlayer.x, DrawX, DrawY - 40);
            //ctx.fillText("y: " + currentPlayer.y, DrawX, DrawY - 60);
            for (i = 0; i < ebRoster.length; i++) {
                if (ebRoster[i].hasHit != true) {
                    playerCheckIsHit(ebRoster[i], currentPlayer);
                }
            }
            if (!currentPlayer.playerHasBeenHit) {
                ctx.beginPath();
                ctx.arc(currentPlayer.x, currentPlayer.y, currentPlayer.size, 0, 2 * Math.PI, false);
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#FF0000';
                ctx.stroke();
            }
        });
    }



