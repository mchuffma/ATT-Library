var GRAVITY = 1;
var MAX_DY = 15;
var MAX_DY_HALF = Math.floor(MAX_DY / 2);
var MAX_DX = 15;
var MAX_DX_HALF = Math.floor(MAX_DX / 2);
var BOUNCE = .75;
var Drop = Class.extend({
  //init is the constructor for the Drop class.
  //@param data The data object. Must have the following parameters:
  //            color (The color of the drop(RGB(), RGBA(), hex, or english values))
  //            x (This drop's x position)
  //            y (This drop's y position)
  //            dx (This drop's x velocity)
  //            dy (This drop's y velocity)
  init : function(data){
    this.color = data.color;
    this.radius = data.radius;
    this.x = data.x;
    this.y = data.y;
    this.dx = data.dx;
    this.dy = data.dy;
    this.isResting = false;
  },
  //isCollided determines if this drop is collided with
  //another drop.
  //@param drop The drop we are checking for a collision.
  isCollided : function(drop){
    var dx = this.x - drop.x;
    var dy = this.y - drop.y;
    var squaredDxDy = ( dx * dx ) + ( dy * dy );
    return squaredDxDy <= ( (this.radius * this.radius) + (drop.radius * drop.radius) );
  },
  //Simply updates the position of this drop.
  update : function(){
    this.x += this.dx;
    this.y += this.dy;
  }
});

var DropManager = Class.extend({
  //init is the constructor function.
  //@param data The data object. Must have the following parameters:
  //            width (The width of the canvas)
  //            height (The height of the canvas)
  //@param $location The location the canvas will be added to. This is a jQuery object.
  init : function(data, $location){
    this.drops = new Array();
    this.width = data.width;
    this.height = data.height;
    var $canvas = $("<canvas width='" + this.width + "' height='" + this.height + "'>");
    $location.append($canvas);
    this.canvas = $canvas[0];
    this.ctx = this.canvas.getContext("2d");
    var that = this;
    //setInterval(function(){
    //  that.doStep();
    //}, 23);
    var render = function(){
      window.requestAnimationFrame(render);
      that.doStep();
      
    };
    render();
    that.doStep();
    setInterval(function(){
      that.drops.forEach(function(droplet){
        droplet.dy += randInt(50);
        droplet.isResting = false;
      });
    }, 45000);
  },

  addDrop : function(drop){
    this.drops.push(drop);
  },

  removeDrop : function(){
    return this.drops.pop();
  },
  
  //Simple adds a random drop to the scene.
  addRandomDrop : function(){
	
	//quaterHeight is used to determine the y Position of the new drop.
    var quaterHeight = Math.round(this.height / 4) * 3;
    
    //Create a random color.
    //var color = "rgba(" + randInt(255) + ", " +  randInt(255) + ", " + randInt(255) + ", " + ((Math.random() * .5) + .5) + ")";
    var color = "rgb(" + randInt(255) + ", " +  randInt(255) + ", " + randInt(255) + ")";
    //Make a random radius size from 5 - 30.
    var radius = randInt(25) + 5;
    //Choose a valid random x coordinate.
    var x = randInt(this.width - (radius * 2) - 2 ) + radius + 1;
    //Choose a valid y coordinate that is above the first quater.
    var y = randInt(this.height - (radius * 2) - 2  + quaterHeight) + radius - quaterHeight;
    //Create random velocities.
    var dx = randInt(MAX_DX) - MAX_DX_HALF;
    var dy = randInt(MAX_DY) - MAX_DY_HALF;
  
    this.addDrop(new Drop({
      color : color,
      radius : radius,
      x : x,
      y : y,
      dx : dx,
      dy : dy
    }));
  },
  
  //doStep is where the scene is painted and the drops positions
  //are modified. This is where we would perform any collision detection.
  //The order of events in this function seem off.
  doStep : function(){
    //that is our context saving variable.
	var that = this;
    
	//Clear the scene first.
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    //Do gravity first
    this.drops.forEach(function(droplet, index){
      var fy = droplet.dy + droplet.y + GRAVITY;
      if(fy <= that.height - droplet.radius){
        droplet.dy += GRAVITY;
      } else if(droplet.dy <= GRAVITY){
    	  droplet.isResting = true;
      }
    });
    
    //For every drop in our scene, do the following:
    this.drops.forEach(function(droplet, index){	
      for(var i = index + 1; i < that.drops.length; i++){
        that.handleCollision(that.drops[i], droplet);
      }
      
      //Have we hit a wall?
      that.detectBounds(droplet);
      
      //Prepare to paint the droplet.
      that.ctx.fillStyle = droplet.color;
      
      //create and paint the circle.
      that.ctx.beginPath();
      that.ctx.arc(droplet.x, droplet.y, droplet.radius, 0, 2 * Math.PI);
      that.ctx.closePath();
      that.ctx.fill();
      
      //Update the droplet.
      droplet.update();
    });
  },
  
  //Detect bounds is used to determine if the droplet should bounce off the floor or the
  //side of the wall.
  detectBounds : function(droplet){
	//Future x value
    var fx = droplet.dx + droplet.x;
    //Future y value
    var fy = droplet.dy + droplet.y;
    
    //If we are hitting a wall, reverse the x velocity
    if(fx <= droplet.radius || fx >= this.width - droplet.radius){
      droplet.dx = -droplet.dx;
    }
    
    //If we are hitting the floor reverse the y velocity with
    //a bounce factor in it.
    if(fy >= this.height - droplet.radius){
      droplet.dy = -Math.floor((droplet.dy - GRAVITY) * BOUNCE);
    }
  },
  
  //Removes all the drops and resets the scene.
  clear : function(){
    this.drops = new Array();
    this.ctx.clearRect(0, 0, this.width, this.height);
  },
  
  //Stuff for collisions.
  //Algorithm obtained from pdf document located at: http://www.vobarian.com/collisions/
  handleCollision : function(drop_1, drop_2){
    var dx = (drop_1.x + drop_1.dx) - (drop_2.x + drop_2.dx);
    var dy = (drop_1.y + drop_1.dy) - (drop_2.y + drop_2.dy);
    var squaredDxDy = ( dx * dx ) + ( dy * dy );
    if( squaredDxDy <= ( (drop_1.radius + drop_2.radius) * (drop_1.radius + drop_2.radius) ) ){
      var norm = {x : drop_2.x - drop_1.x,
                 y : drop_2.y - drop_1.y};
      var mag = Math.sqrt( (norm.x * norm.x ) + ( norm.y * norm.y) );
      var uN = {x: norm.x / mag, y : norm.y / mag};
      var uT = {x: -uN.y, y: uN.x};
      
      var v_1n = (uN.x * drop_1.dx) + (uN.y * drop_1.dy);
      var v_1t = (uT.x * drop_1.dx) + (uT.y * drop_1.dy);
      var v_2n = (uN.x * drop_2.dx) + (uN.y * drop_2.dy);
      var v_2t = (uT.x * drop_2.dx) + (uT.y * drop_2.dy);
      
      var dr = drop_1.radius - drop_2.radius;
      var sig_r = drop_1.radius + drop_2.radius;
      
      var v_1nn = ( v_1n * ( dr ) + ( 2 * drop_2.radius * v_2n ) ) / ( sig_r );
      var v_2nn = ( v_2n * ( -dr ) + ( 2 * drop_1.radius * v_1n ) ) / ( sig_r );
      
      var v_1_norm = {x : uN.x * v_1nn, y: uN.y * v_1nn};
      var v_2_norm = {x : uN.x * v_2nn, y: uN.y * v_2nn};
      var v_1_tan = {x : uT.x * v_1t, y: uT.y * v_1t};
      var v_2_tan = {x : uT.x * v_2t, y: uT.y * v_2t};
      
      drop_1.dx = Math.round(v_1_norm.x + v_1_tan.x);
      drop_2.dx = Math.round(v_2_norm.x + v_2_tan.x);
      if(drop_1.isResting){
        drop_2.dy = Math.floor((v_2_norm.y + v_2_tan.y - v_1_norm.y - v_1_tan.y - GRAVITY) * .45);
      } else if(drop_1.isResting){
        drop_1.dy = Math.floor((v_1_norm.y + v_1_tan.y - v_2_norm.y - v_2_tan.y - GRAVITY) * .45);
      } else {
        drop_1.dy = Math.floor((v_1_norm.y + v_1_tan.y) * .75);
        drop_2.dy = Math.floor((v_2_norm.y + v_2_tan.y) * .75);
      }
    }
 }
});