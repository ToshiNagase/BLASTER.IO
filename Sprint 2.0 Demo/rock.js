var rockRoster = [];
var rockID = 0;

function rock(id,width,height,x,y)
{
	this.id = id;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
}

function addrock(width,height, x, y) 
{
    rockRoster[rockID] = new rock(rockID, width, height, x, y);
    rockID += 1;
}

function playerReflect(bullet, currentrock) {
        if ((bullet.xPos > currentrock.x) && (bullet.yPos > currentrock.y)
        	&& (bullet.xPos < (currentrock.x + currentrock.width)) &&
        	(bullet.yPos < (currentrock.y + currentrock.height)))
        {
        	if (!bullet.hasReflect) {
        		var angle = 180 * Math.atan((playerRoster[0].y - currentrock.y) / (playerRoster[0].x - currentrock.x)) / Math.PI;
        		if (angle < 45 && angle > -45 || angle > 135 && angle < 215) {
		        	bullet.dx = -bullet.dx;
		        	bullet.dy = bullet.dy;
		        }
		        else {
		        	bullet.dx = bullet.dx;
		        	bullet.dy = -bullet.dy;
		        }
        	}
        	bullet.hasReflect = true;
        }
}

function enemyReflect(eb, currentrock) {
        /*if ((eb.xPos > currentrock.x) && (eb.yPos > currentrock.y)
        	&& (eb.xPos < (currentrock.x + currentrock.width)) &&
        	(eb.yPos < (currentrock.y + currentrock.height)))
        {
        	if (!eb.hasReflect) {
	        	var angle = 180 * Math.atan((eb.y - currentrock.y) / (eb.x - currentrock.x)) / Math.PI;
        		if (angle < 45 && angle > -45 || angle > 135 && angle < 215) {
		        	eb.dx = -eb.dx;
		        	eb.dy = eb.dy;
		        }
		        else {
		        	eb.dx = eb.dx;
		        	eb.dy = -eb.dy;
		        }
        	}
        	eb.hasReflect = true;
        }*/
}

function drawrock()
{
	rockRoster.forEach(function(currentrock)
    {
		for (i = 0; i < bulletRoster.length; i++)
		{
            playerReflect(bulletRoster[i], currentrock);
        }

        for (j = 0; j < ebRoster.length; j++)
		{
            enemyReflect(ebRoster[j], currentrock);
        }

		var rock_image = new Image();
		rock_image.src = 'Image_rock.jpeg';
		//rock_image.onload = function()
		//{
			var canvas = document.getElementById('blaster');
	    	if (!canvas.getContext) return;
	    	var ctx = canvas.getContext('2d');
			//            image      left top w h
			ctx.drawImage(rock_image,currentrock.x,currentrock.y,currentrock.width,currentrock.height);
		//}
	});
	//<img src="image_rock1.jpeg" alt = "rock" width ="500" height = "600">
	//http://clipart-library.com/clipart/1056689.htm
}