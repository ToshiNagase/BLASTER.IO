var mouseX =0;
var mouseY =0;

 
function setMousePosition(e) 
{
  mouseX = e.clientX;
  mouseY = e.clientY;
}      

// canvas.onmousedown = function (e) {
//    addBullet("black", 10, 2, player.x, player.y, e.x, e.y);
// }
function getPosition(e)
{
    if (!playerRoster[0].playerHasBeenHit) {
      addBullet("red", 5, 5, playerRoster[0].x, playerRoster[0].y, e.x, e.y);
    }
}

/*
function getPosition(el) 
{
  var xPosition = 0;
  var yPosition = 0;
 
  while (el) 
  {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    el = el.offsetParent;
  }
  return 
  {
    x: xPosition,
    y: yPosition
  };
}       
*/
