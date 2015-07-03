README DOCUMENT FOR CSC 342 FINAL PROJECT : FOOTBALL FIELD

Team Members:
	1.) Dylan Perry
	2.) Nolan Piland
	3.) Ben Leeds
	4.) Michael Huffman
	5.) Rebecca Schloe
	6.) John Mitchell
	
Project Goal:
	The goal of this project was to provide meaningful generative art to go on the screen above the help desk in Hunt Library.
	
Our Solution:
	Monitor the number of people entering and exiting the football field. Each person represents an animated football player either running towards or away from the center of the field, which holds the NC State logo. The NC State logo gradually feels with color as more and more people enter the library and loses color as people exit. At the top is a scoreboard that shows the current time and for now shows the percentage of how occupied/vacant the library is. In time this will show study rooms.

HOW TO USE:
	1.) Clone From GitHub
	2.) Install TomCat 7.0 and higher and configure.
		- Edit project class path to including all Tomcat libraries as well as the MySQL connector Library
	3.) Install/Ensure you have MYSQL on your local machine.
	3.) Edit the file context.xml found at WebContent\META-INF\context.xml
			- Change the username and password in this file to match what your particular MYSQL username and password are.
	4.) Add to the tomcat server
	5.) Run and watch the magic begin.

Further Implenetation Goals:
	Our further goal is to connect with an arduino system to actually dynamically track when people enter and exit the system. This is based on them walking through a laser, which would then send a signal to the arduino system and then on to our project, causing the result of a player to be either entering or exiting the library. For now, however, it is automatically populating itself every 5 seconds, assuming that every 5 seconds 5 people either enter or exit the library or any combination of the two. Going forward we look to actually make progress in interfacing with the arduino system as well as Library APIs to accurately monitor how full the library is.
