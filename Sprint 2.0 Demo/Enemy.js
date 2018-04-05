var enemyID = 0;
//var hasBeenHit = false;
//var hasBeenHit;

    function enemy(id, color, size, x, y, speed) {
        this.id = id;
        this.color = color;
        this.size = size;
        this.x = x;
        this.y = y;
        this.mapX = x;
        this.mapY = y;
        this.speed = speed;
        this.hasBeenHit = false;
        this.num = 0;
        this.randX = 0;
        this.randY = 0;
    }
    var enemyRoster = [];

    function addEnemy(color, size, x, y, speed) {
        enemyRoster[enemyID] = new enemy(enemyID, color, size, x, y,speed);
        enemyID += 1;
    }

    function updateEnemy(enemy, player)
    {
        var eSpeed = -0.9;
        var playerx = enemy.x - player.x;
        var playery = enemy.y - player.y;

        var dx = playerx;
        var dy = playery;

        var distance = Math.sqrt(Math.pow(playerx, 2) + Math.pow(playery, 2));

        if (distance < 100)
        {
            if (enemy.num == 100)
            {
                enemy.randX = Math.floor(Math.random() * 101);
                enemy.randY = Math.floor(Math.random() * 101);
                enemy.num = 0;
            }

            dx = enemy.randX;
            dy = enemy.randY;
            eSpeed = -5.0
            enemy.num++;
        }
        /*var bulletx;
        var bullety;
        var dx;
        var dy;
        var slope;
        playerDistance = Math.sqrt((enemy.x - player.xPos) * (enemy.x - player.xPos) +(enemy.y - player.yPos) * (enemy.y - player.yPos));;
        if (bulletRoster.length > 0) {
            var bulletx = bulletRoster[0].xPos - enemy.x;
            var bullety = bulletRoster[0].yPos - enemy.y;
            slope = bulletRoster[0].dy / bulletRoster[0].dx;
            playerDistance = Math.sqrt((enemy.x - player.xPos) * (enemy.x - player.xPos) +(enemy.y - player.yPos) * (enemy.y - player.yPos));
            for (i = 0; i < bulletRoster.length; i++) {
                if (bulletRoster[i] != null && !bulletRoster[i].hasHit && (bulletRoster[i].xPos - enemy.x)*(bulletRoster[i].xPos - enemy.x)+(bulletRoster[i].yPos - enemy.y)*(bulletRoster[i].yPos - enemy.y)<bulletx*bulletx+bullety*bullety) {
                    bulletx = bulletRoster[i].xPos - enemy.x;
                    bullety = bulletRoster[i].yPos - enemy.y;
                    slope = bulletRoster[i].dy / bulletRoster[i].dx;
                }
            }
            if (playerx*playerx+playery*playery<bulletx*bulletx+bullety*bullety) {
            dx = playerx;
            dy = playery;
            }
            else {
                slope = 1 / slope;
                dx = -1;
                dy = slope;
            }
        }
        else {
            dx = playerx;
            dy = playery;
        }
        if (playerDistance > 0) {
            dx = playerx;
            dy = playery;
        }*/
        /*if (enemy.x > (window.innerWidth - 100) || enemy.x < 100) {
            dx = 0;
        }
        if (enemy.y > (window.innerHeight - 100) || enemy.y < 100) {
            dy = 0;
        }*/


        var mag = Math.sqrt(dx*dx+dy*dy);

        //if (mag > 33)
        //{
            var velX = (dx/mag) * eSpeed;
            var velY = (dy/mag) * eSpeed;    
            enemy.x = velX + enemy.x;
            enemy.y = velY + enemy.y;
        //}

    }

    function checkIsHit(bullet, currentEnemy) {
        if (Math.sqrt((currentEnemy.x - bullet.xPos)*(currentEnemy.x - bullet.xPos)+(currentEnemy.y - bullet.yPos)*(currentEnemy.y - bullet.yPos)) *2 / 3<= currentEnemy.size)
            {
                if (!currentEnemy.hasBeenHit && !bullet.hasHit) {
                     //clearBullet();
                     currentEnemy.hasBeenHit = true;
                     //removeBullet(bullet.bulletID);
                     //bulletRoster[bullet.bulletID] = null;
                     bullet.hasHit = true;
                 }
            }
    }

    function clearEnemy()
    {        
        enemyRoster.forEach(function(currentEnemy)
        {
            var canvas = document.getElementById('blaster');
            if (!canvas.getContext) return;
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, 1000, 1000);
        });
    }

    function drawEnemy()
    {
    //    $.each(playerRoster, function (index, currentPlayer)
        var counter = 0;
        enemyRoster.forEach( function (currentEnemy)
        {
            if (currentEnemy.hasBeenHit)
            {
                counter++;
            }
            if (counter == enemyRoster.length)
            {
                window.alert("you win!");
                exit();
            }
            
            updateEnemy(currentEnemy, playerRoster[0]);
            DrawX = currentEnemy.x;
            DrawY = currentEnemy.y;
            rectWidth = currentEnemy.size;
            rectHeight = currentEnemy.size;
            var canvas = document.getElementById('blaster');
            if (!canvas.getContext) return;
            var ctx = canvas.getContext('2d');
            //ctx.fillStyle = currentPlayer.color;
            //ctx.fillRect(DrawX, DrawY, rectWidth, rectHeight);

            //ctx.fillText("id: " + currentPlayer.id, DrawX, DrawY);
            //ctx.fillText("speed: " + currentPlayer.speed, DrawX, DrawY - 20);
            //ctx.fillText("x: " + currentPlayer.x, DrawX, DrawY - 40);
            //ctx.fillText("y: " + currentPlayer.y, DrawX, DrawY - 60);
            for (i = 0; i < bulletRoster.length; i++) {
                    checkIsHit(bulletRoster[i], currentEnemy);
            }
            if (!currentEnemy.hasBeenHit) {
                ctx.beginPath();
                //ctx.arc(width / 2 + player.x - currentEnemy.x, height / 2  + player.y - currentEnemy.y, currentEnemy.size, 0, 2 * Math.PI, false);
                ctx.arc(currentEnemy.x,currentEnemy.y, currentEnemy.size, 0, 2 * Math.PI, false);
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#0000FF';
                ctx.stroke();
            }

            /*if (currentEnemy.x == bullet.xPos && currentEnemy.y == bullet.yPos)
            {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, 1000, 1000);
            }*/
        });



    }
