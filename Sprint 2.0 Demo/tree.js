var treeRoster = [];
var treeID = 0;

function tree(id,width,height,x,y)
{
	this.id = id;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
}

function addTree(width,height, x, y) 
{
    treeRoster[treeID] = new tree(treeID, width, height, x, y);
    treeID += 1;
}

function playerShot(bullet, currentTree) {
        if ((bullet.xPos > currentTree.x) && (bullet.yPos > currentTree.y)
        	&& (bullet.xPos < (currentTree.x + currentTree.width)) &&
        	(bullet.yPos < (currentTree.y + currentTree.height)))
        {
        	bullet.hasHit = true;
        }
}

function enemyShot(eb, currentTree) {
        if ((eb.xPos > currentTree.x) && (eb.yPos > currentTree.y)
        	&& (eb.xPos < (currentTree.x + currentTree.width)) &&
        	(eb.yPos < (currentTree.y + currentTree.height)))
        {
        	eb.hasHit = true;
        }
}

function drawTree()
{
	treeRoster.forEach(function(currentTree)
    {
		for (i = 0; i < bulletRoster.length; i++)
		{
            playerShot(bulletRoster[i], currentTree);
        }

        for (j = 0; j < ebRoster.length; j++)
		{
            enemyShot(ebRoster[j], currentTree);
        }

		var tree_image = new Image();
		tree_image.src = 'Image_tree.jpeg';
		//tree_image.onload = function()
		//{
			var canvas = document.getElementById('blaster');
	    	if (!canvas.getContext) return;
	    	var ctx = canvas.getContext('2d');
			//            image      left top w h
			ctx.drawImage(tree_image,currentTree.x,currentTree.y,currentTree.width,currentTree.height);
		//}
	});
	//<img src="image_tree1.jpeg" alt = "tree" width ="500" height = "600">
	//http://clipart-library.com/clipart/1056689.htm
}