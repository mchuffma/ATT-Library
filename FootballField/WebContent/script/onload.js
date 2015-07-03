$(document).ready(function(){
  var dbTime = new Date().getTime();
  var IMG_SRC = "./img/football-player.gif";
  var ANIMATION_SPEED = 2250;
  var MAX_VALUE = 100;
  
  var $sea = $("#red_sea");
  var height = 50;
  var title = $("title")[0];
  var entering = 0;
  var foo=new Sound("./sounds/grunt.mp3",100,false);
  var crowd=new Sound("./sounds/crowd.mp3",100,false);
  var cheer=new Sound("./sounds/cheer.mp3",100,false);
  var starting = 0;
  document.getElementById("right_score").innerHTML = "" + height;
  document.getElementById("left_score").innerHTML = "" + 100-height;
  
  var colonToggle = true;
  var time = document.getElementById("time");
  
  function startTime() {
	    var today=new Date();
	    var h=today.getHours();
	    var is12 = 0;

	    if(h >= 12) {
        is12 = 1;
	    } else {
        is12 = 0;
      }
	    var m=today.getMinutes();
	    m = checkTime(m);
	    if( is12 == 1) {
	    if(h == 12) {
        document.getElementById('time').innerHTML = (h ) +":"+m;
	    } else {
	    	document.getElementById('time').innerHTML = (h - 12 ) +":"+m;
	    }
        $("#am").css("visibility","hidden");
        $("#pm").css("visibility","show");
	    } else {
        document.getElementById('time').innerHTML = h+":"+m;
        $("#pm").css("visibility","hidden");
        $("#am").css("visibility","show");
	    }
	    if(colonToggle){
	    	time.innerHTML = time.innerHTML.replace(":", " ");
	    }
	    colonToggle = !colonToggle;
	    var t = setTimeout(function(){startTime()},1000);
	}

	function checkTime(i) {
	    if (i<10) {i = "0" + i};
	    return i;
	}
  
  startTime();

  window.onresize = function() {
    $("body").css("font-size", 100 * (window.innerWidth / 1438) + "%");
  }
  $("body").css("font-size", 100 * (window.innerWidth / 1438) + "%");

  var animateIn = function(){
    if(height + entering >= MAX_VALUE){
      return;
    }
    if (height + entering == MAX_VALUE - 1 && starting == 0) {
      crowd.start();
      starting = 1;
    }
    entering++;
    starting = 0;
    var $img = $("<img src='" + IMG_SRC + "' style='z-index: 3;' />");
    $("#background").prepend($img);
    var topPosition = (Math.random() * (window.innerHeight - $img.height()));
    $img.css("top", topPosition + "px");
    var rotation = 0;
    var midHeight = window.innerHeight / 2;
    var midWidth = window.innerWidth / 2;
    if (topPosition < midHeight) {
      rotation = Math.atan((midHeight - topPosition) / midWidth) * 180 / Math.PI;
    } else {
      rotation = "-" + Math.atan((topPosition - midHeight) / midWidth) * 180 / Math.PI;
    }
    $img.css("transform", "rotate(" + rotation + "deg)");
    $img.animate({left: midWidth + "px",
                   top: midHeight + "px"},
      ANIMATION_SPEED,
      "linear", 
      function(){
        $(this).remove();
        height += 1;
        title.text = "Occupied: " + height + "%";
        $sea.css("height", (height) + "%");
        document.getElementById("right_score").innerHTML = "" + height;
        document.getElementById("left_score").innerHTML = "" + 100-height;
        // added this transition again for a more liquid "feel", but feel free to remove it
        $sea.css('transition', 'height 1s ease');
        foo.start();
        entering--;
      });
  };


  var animateOut = function(){
    if(height <= 0){
      return;
    }
    if (height + entering == MAX_VALUE) {
      crowd.stop();
    }
    // WARNING: If you uncomment this, do not hold down or spam a key press.  Things can get loud quickly.
    cheer.start();
    height -= 1;
    title.text = "Occupied: " + height + "%";
    $sea.css("height", (height) + "%");
    document.getElementById("right_score").innerHTML = "" + height;
    document.getElementById("left_score").innerHTML = "" + 100-height;
    // added this transition again for a more liquid "feel", but feel free to remove it
    $sea.css('transition', 'height 1s ease');

    var $img = $("<img src='" + IMG_SRC + "' style='z-index: 3;' />");
    $("#background").prepend($img);

    var midHeight = window.innerHeight / 2;
    var midWidth = window.innerWidth  /2;
    $img.css({left: (midWidth) + "px",
                   top: (midHeight) + "px"});

    var destinationFromTop = Math.random() * (window.innerHeight - $img.height());
    var rotation = 0;
    if (destinationFromTop < midHeight) {
      rotation = "-" + Math.atan((midHeight - destinationFromTop) / midWidth) * 180 / Math.PI;
    } else {
      roation = Math.atan((destinationFromTop - midHeight) / midWidth) * 180 / Math.PI;
    }

    $img.css("transform", "rotate(" + rotation + "deg)");
    
    $img.animate({left: (window.innerWidth - $img.width()) + "px",
                   top: (destinationFromTop) + "px"},
      ANIMATION_SPEED,
      "linear", 
      function(){
        $(this).remove();
      });
  };
  
  setInterval(function(){
	    $.ajax({
	    	  type: "GET",
	    	  dataType: "JSON",
	      	  url: "./src/WebClassServlet",
	      	  data: {"time": dbTime},
	      	  success: function(result){
	      		  dbtime = parseInt(result.time);
	      		  var numppl = result.numOfPeople;
	      		  automatePeople(numppl);
	      	  }
	      }); 
  }, 5000);
  
  
  var automatePeople = function(people){
	  var newPeople = parseInt(people);
	  if(newPeople > 0){
		  for(var i =0; i < newPeople; i++){
			  animateIn();
		  }
	  }
	  else{
		  newPeople *= -1;
		  for(var i =0; i < newPeople; i++){
			  animateOut();
		  }
	  }
  };
  
  
  $("body").on("click", function(){
    animateIn();    
  });

  $("body").on("keypress", function(){
    animateOut();
  });
});
