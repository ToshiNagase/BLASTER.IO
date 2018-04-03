var ebRoster = [];
var ebID = 0;

function eb(id, color, size, speed, xPos, yPos)
{
	this.id = id;
	this.color = color;
	this.size = size;
	this.speed = speed;
	this.xPos = xPos;
	this.yPos = yPos;
    this.hasHit = false;
    this.initX = xPos;
    this.initY = yPos;
    this.dx = 0;
    this.dy = 0;
    this.hasReflect = false;
}

function addEb(color,rSize,rSpeed,rxPos,ryPos)
{
	ebRoster[ebID] = new eb(ebID,color,rSize,rSpeed,rxPos,ryPos);
	ebID+=1;
}

function updateEb(eb, player)
{
    dx = eb.initX - player.x;
    dy = eb.initY - player.y;
	var mag = Math.sqrt(dx * dx + dy * dy);

    var velX = (dx/mag) * eb.speed;
    var velY = (dy/mag) * eb.speed;    
    eb.xPos = velX + eb.xPos;
    eb.yPos = velY + eb.yPos;
}

function drawEb()
{        
    ebRoster.forEach(function(currentEb)
    {
        if (currentEb.hasHit == false) {
            updateEb(currentEb, playerRoster[0], enemyRoster[0]);
            
            var canvas = document.getElementById('blaster');
            if (!canvas.getContext) return;
            var ctx = canvas.getContext('2d');
                ctx.fillStyle = currentEb.color;
                ctx.fillRect(currentEb.xPos, currentEb.yPos, currentEb.size, currentEb.size);
        }
    });
}


function clearEb()
{        
    ebRoster.forEach(function(currentEb)
    {
        var canvas = document.getElementById('blaster');
        if (!canvas.getContext) return;
        var ctx = canvas.getContext('2d');
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, 1000, 1000);



    });
}