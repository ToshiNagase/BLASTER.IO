var loseRoster = [];
var loseID = 0;

function lose(id,width,height,x,y)
{
	this.id = id;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
}

function addLose(width,height, x, y) 
{
    loseRoster[loseID] = new lose(loseID, width, height, x, y);
    loseID += 1;
}


function drawLose()
{
	loseRoster.forEach(function(currentLose) {
	var lose_image = new Image();
	lose_image.src = 'unlucky.jpeg';
	//tree_image.onload = function()
	//{
		var canvas = document.getElementById('blaster');
    	if (!canvas.getContext) return;
    	var ctx = canvas.getContext('2d');
		//            image      left top w h
		ctx.drawImage(lose_image,currentLose.x,currentLose.y,currentLose.width,currentLose.height);
	//}
	});
	
	//<img src="image_tree1.jpeg" alt = "tree" width ="500" height = "600">
	//http://clipart-library.com/clipart/1056689.htm
}