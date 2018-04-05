var bulletRoster = [];
var bulletID = 0;

function bullet(id, color, size, speed, xPos, yPos, mouseX, mouseY)
{
	this.id = id;
	this.color = color;
	this.size = size;
	this.speed = speed;
	this.xPos = xPos;
	this.yPos = yPos;
        this.mousex = mouseX;
        this.mousey = mouseY;
        this.hasHit = false;
        this.dx = mouseX - xPos;
        this.dy = mouseY - yPos;
        var mag = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.dx = this.dx / mag * this.speed;
        this.dy = this.dy / mag * this.speed;
        this.xOrigin = xPos;
        this.yOrigin = yPos;
        this.hasReflect = false;
        this.playerX;
        this.playerY;
	//this.velX = velX;
	//this.velY = velY;
}

function addBullet(color,rSize,rSpeed,rxPos,ryPos,rmouseX,rmouseY)
{
	bulletRoster[bulletID] = new bullet(bulletID,color,rSize,rSpeed,rxPos,ryPos,rmouseX,rmouseY);
    bulletRoster[bulletID].playerX = playerRoster[0].x;
    bulletRoster[bulletID].playerY = playerRoster[0].y;
	bulletID+=1;
}

function updateBullet(bullet, player)
{   
    bullet.xPos = bullet.dx + bullet.xPos;
    bullet.yPos = bullet.dy + bullet.yPos;
        //bullet.yPos = 30 + bullet.yPos;
        //bullet.xPos = 30 + bullet.xPos;
}

function drawBullet()
{        
//    $.each(bulletRoster, function (index, bullet)
    bulletRoster.forEach(function(currentBullet)
    {
        if (!currentBullet.hasHit) {
            updateBullet(currentBullet, playerRoster[0]);
            var canvas = document.getElementById('blaster');
            if (!canvas.getContext) return;
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = currentBullet.color;
            ctx.fillRect(currentBullet.xPos, currentBullet.yPos, currentBullet.size, currentBullet.size);
            //ctx.arc(currentBullet.xPos,currentBullet.yPos,2,0,6.28);
            //ctx.fill();

            //ctx.beginPath();
            //ctx.arc(currentBullet.xPos, currentBulllet.yPos, currentBullet.size, 0, 2 * Math.PI, false);
            //ctx.fillStyle;
            //ctx.lineWidth = 3;
            //ctx.strokeStyle = '#FF0000';
            //ctx.stroke();
        }

        /*else
        {
            removeBullet(bulletRoster.indexOf(currentBullet));
        }*/
    });
}

function removeBullet(i)
{
    bulletRoster.splice(i, 1);
}

function clearBullet()
{        
//    $.each(bulletRoster, function (index, bullet)
    bulletRoster.forEach(function(currentBullet)
    {
        //updateBullet(currentBullet, playerRoster[0]);
    var canvas = document.getElementById('blaster');
    if (!canvas.getContext) return;
    var ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 1000, 1000);
        //ctx.arc(currentBullet.xPos,currentBullet.yPos,2,0,6.28);
        //ctx.fill();



    });
}