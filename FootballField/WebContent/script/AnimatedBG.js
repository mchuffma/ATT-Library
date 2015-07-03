$(document).ready(function(){
	  var canvas = $("#animated_sea")[0];
	  var ctx = canvas.getContext("2d");
	  var MAX_HEIGHT = 3;
	  
	  ctx.fillStyle = "#CC0000";
	  
	  var heights = new Array(Math.floor(canvas.width / 2));
	  
	  
	  var dampen = function(x){
	    x = x * Math.PI / 180;
	    return (MAX_HEIGHT * Math.sin(x * 6));
	  };
	  
	  for(var i = 0; i < heights.length; i++){
	    heights[i] = dampen(-i);
	  }

	  var render = function( level ){
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.beginPath();
	    
	    ctx.moveTo(canvas.width, canvas.height);
	    ctx.lineTo(0, canvas.height);
	    var dx = Math.round(canvas.width / heights.length);
	    var i = 0;
	    for(; i < heights.length - 1; i++){
	      ctx.lineTo(dx * i, canvas.height - (level + heights[i]));
	    }
	    ctx.lineTo(canvas.width, canvas.height - (level + heights[i]));
	    ctx.closePath();
	    ctx.fill();
	  };
	  
	  var ctr = 0;

	  var animate = function(fromLeft){
	    setInterval(function(){
	      if(fromLeft){
	        for(var i = heights.length - 1; i > 0; i--){
	          heights[i] = heights[i - 1];
	        }
	        heights[0] = dampen(ctr);
	        ctr += 1;
	      } else {
	        for(var i = heights.length - 1; i >= 0; i--){
	          heights[i - 1] = heights[i];
	        }
	        ctr += 1;
	        heights[heights.length - 1] = dampen(ctr);
	      }
	      render(MAX_HEIGHT);
	    }, 23);
	  };
	  animate(true);

	  var canvas = $("#animated_sea_2")[0];

	  var ctx2 = canvas.getContext("2d");
	  
	  ctx2.fillStyle = "#DA4747";
	  
	  var heights2 = new Array(Math.floor(canvas.width / 2));
	  
	  
	  var dampen2 = function(x){
	    x = x * Math.PI / 180;
	    return (MAX_HEIGHT * Math.sin(x * 4));
	  };
	  
	  for(var i = 0; i < heights2.length; i++){
	    heights2[i] = dampen2(-i);
	  }

	  var render2 = function( level ){
	    ctx2.clearRect(0, 0, canvas.width, canvas.height);
	    ctx2.beginPath();
	    
	    ctx2.moveTo(canvas.width, canvas.height);
	    ctx2.lineTo(0, canvas.height);
	    var dx = Math.round(canvas.width / heights2.length);
	    var i = 0;
	    for(; i < heights2.length - 1; i++){
	      ctx2.lineTo(dx * i, canvas.height - (level + heights2[i]));
	    }
	    ctx2.lineTo(canvas.width, canvas.height - (level + heights2[i]));
	    ctx2.closePath();
	    ctx2.fill();
	  };
	  
	  var ctr2 = 0;

	  var animate2 = function(fromLeft){
	    setInterval(function(){
	      if(fromLeft){
	        for(var i = 0; i < heights2.length - 1; i++){
	          heights2[i] = heights2[i + 1];
	        }
	        heights2[heights2.length - 1] = dampen2(ctr2);
	        ctr2 += 1;
	      }
	      render2(MAX_HEIGHT);
	    }, 23);
	  };
	  animate2(true);

});