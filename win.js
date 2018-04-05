var winRoster = [];
var winID = 0;

function win(id,width,height,x,y)
{
	this.id = id;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
}

function addWin(width,height, x, y) 
{
    winRoster[winID] = new win(winID, width, height, x, y);
    winID += 1;
}


function drawWin()
{
	winRoster.forEach(function(currentWin) {
	var win_image = new Image();
	win_image.src = 'win.jpeg';
	//tree_image.onload = function()
	//{
		var canvas = document.getElementById('blaster');
    	if (!canvas.getContext) return;
    	var ctx = canvas.getContext('2d');
		//            image      left top w h
		ctx.drawImage(win_image,currentWin.x,currentWin.y,currentWin.width,currentWin.height);
	//}
	});
	
	//<img src="image_tree1.jpeg" alt = "tree" width ="500" height = "600">
	//http://clipart-library.com/clipart/1056689.htm
}