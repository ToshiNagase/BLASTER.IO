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
    }
    var enemyRoster = [];
    var threatRoster = [];
    var bX = 1.0;

    function addEnemy(color, size, x, y,speed) {
        enemyRoster[enemyID] = new enemy(enemyID, color, size, x, y,speed);
        enemyID += 1;
    }

    function magnitude(xi, yi, xf, yf)
    {
        return Math.sqrt(Math.pow((xf-xi), 2) + Math.pow((yf-yi), 2));
    }

    function angle(x0, y0, x1, y1, x2, y2)
    {
        return Math.acos(((x1 - x0)*(x2 - x0)+(y1 - y0)*(y2-y0)) /
            (magnitude(x0, y0, x1, y1) * magnitude(x0, y0, x2, y2)));
    }

    function closestThreat(enemy)
    {
        var near = 100000000000;
        var ind = -1;
        for (i = 0; i < bulletRoster.length; i++)
        {
            var distance = magnitude(bulletRoster[i].xPos, bulletRoster[i].yPos, enemy.x, enemy.y);
            if ((distance < near) && (threatRoster[i]))
            {
                ind = i;
                near = distance;
            }
        }

        return ind;
    }

    function determineThreat(enemy)
    {
        var aX;
        var aY;
        var bY;
        var c;
        var point1x;
        var point1y;

        for (i = 0; i < bulletRoster.length; i++)
        {
            aX = bulletRoster[i].xPos - bulletRoster[i].xOrigin;
            aY = bulletRoster[i].yPos - bulletRoster[i].yOrigin;

            bY = (-1)*(aX/aY);

            c = enemy.size / magnitude(0, 0, bX, bY);

            point1x = enemy.x + bX*c;
            point1y = enemy.y + bY*c;

            if (((angle(bulletRoster[i].xPos, bulletRoster[i].yPos, (aX*(-1)), (aY*(-1)), enemy.x, enemy.y)) <=
                (angle(bulletRoster[i].xPos, bulletRoster[i].yPos, point1x, point1y, enemy.x, enemy.y))) &&
                (magnitude(bulletRoster[i].xOrigin, bulletRoster[i].yOrigin, enemy.x, enemy.y)  >
                magnitude(bulletRoster[i].xOrigin, bulletRoster[i].yOrigin, bulletRoster[i].xPos, bulletRoster[i].yPos)))
            {
                threatRoster[i] = true;
            }
            else
            {
                threatRoster[i] = false;
            }

        }

    }



    function updateEnemy(enemy, player)
    {
        var eSpeed = -0.9;
        //var playerx = enemy.x - player.x;
        //var playery = enemy.y - player.y;

        var nearby = 500;

        var aX;
        var aY;
        var bY;

        var dx = enemy.x - player.x;
        var dy = enemy.y - player.y;

        determineThreat(enemy);

        var danger = closestThreat(enemy);
        if ((danger != -1))
        {
            if (nearby > magnitude(bulletRoster[danger].xPos, bulletRoster[danger].yPos, enemy.x, enemy.y))
            {
                aX = bulletRoster[i].xPos - bulletRoster[i].xOrigin;
                aY = bulletRoster[i].yPos - bulletRoster[i].yOrigin;

                bY = (-1)*(aX/aY);

                dx = bX;
                dy = bY;
            }
        }

        var mag = Math.sqrt(dx*dx+dy*dy);

        var velX = (dx/mag) * eSpeed;
        var velY = (dy/mag) * eSpeed;    
        enemy.x = velX + enemy.x;
        enemy.y = velY + enemy.y;
/*


        var bulletx;
        var bullety;
        var dx;
        var dy;
        var slope;
        if (bulletRoster.length > 0) {
            var bulletx = bulletRoster[0].xPos - enemy.x;
            var bullety = bulletRoster[0].yPos - enemy.y;

            slope = bulletRoster[0].dy / bulletRoster[0].dx;
            
            for (i = 0; i < bulletRoster.length; i++) {
                if (bulletRoster[i] != null && !bulletRoster[i].hasHit &&
                    (bulletRoster[i].xPos - enemy.x)*(bulletRoster[i].xPos - enemy.x)+
                    (bulletRoster[i].yPos - enemy.y)*(bulletRoster[i].yPos - enemy.y)<
                    bulletx*bulletx+bullety*bullety) {
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
        
        var mag = Math.sqrt(dx*dx+dy*dy);

        //if (mag > 33)
        //{
            var velX = (dx/mag) * eSpeed;
            var velY = (dy/mag) * eSpeed;    
            enemy.x = velX + enemy.x;
            enemy.y = velY + enemy.y;
        //}*/

    }

    function checkIsHit(bullet, currentEnemy) {
        if (Math.sqrt((currentEnemy.x - bullet.xPos)*(currentEnemy.x - bullet.xPos)+(currentEnemy.y - bullet.yPos)
            *(currentEnemy.y - bullet.yPos)) *2 / 3<= currentEnemy.size)
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
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        });
    }

    function drawEnemy()
    {
    //    $.each(playerRoster, function (index, currentPlayer)
        enemyRoster.forEach( function (currentEnemy)
        {
            updateEnemy(currentEnemy, playerRoster[0]);
            /*DrawX = currentEnemy.x;
            DrawY = currentEnemy.y;
            rectWidth = currentEnemy.size;
            rectHeight = currentEnemy.size;*/
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
// Hello world


    }
