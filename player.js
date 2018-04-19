//var playerHasBeenHit = false;    
var playerID = 0;

var maxSpeed = 3;

var friction = 0.98;
    function player(id, color, size, x, y, speed) {
        this.id = id;
        this.color = color;
        this.size = size;
        this.x = width / 2;
        this.mapX = x;
        this.mapY = y;
        this.y = height / 2;
        this.xVel = 0;
        this.yVel = 0;
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
            if (player.yVel > -maxSpeed) {
                player.yVel --;
                up = false;
            }
        }
        if(down){
            if (player.yVel < maxSpeed) {
                player.yVel ++;
                down = false;
            }
        }
        if(left){
            if (player.xVel > -maxSpeed) {
                player.xVel --;
                left = false;
            }
        }
        if(right){
            if (player.xVel < maxSpeed) {
                player.xVel ++;
                right = false;
            }
        }
        
        player.xVel *= friction;
        player.yVel *= friction;
        if(player.xVel > maxSpeed) {
            player.xVel = maxSpeed;
        }
        if (player.xVel < - maxSpeed) {
            player.xVel = -maxSpeed;
        }
        if (player.yVel > maxSpeed) {
            player.yVel = maxSpeed;
        }
        if (player.yVel < -maxSpeed) {
            player.yVel = -maxSpeed;
        }
        player.y += player.yVel;
        
        player.x += player.xVel;
        if (player.y > window.innerHeight) {
            player.y = window.innerHeight;
            player.yVel = 0;
        }
        else if (player.y < 0) {
            player.y = 0;
            player.yVel = 0;
        }
        if (player.x > window.innerWidth) {
            player.x = window.innerWidth;
            player.xVel = 0;
        }
        else if (player.x < 0) {
            player.x = 0;
            player.xVel = 0;
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
                     window.alert("you dead");
                     game = false;
                     win = false;
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



