<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Sean's Website</title>
	
	<link rel="stylesheet" type="text/css" href="style.css">
</head>

<body>
	<?php session_start(); ?>
    <div class="container">
        <header>
<!--
        <div id="logo"><a href"#"><img src="Resources/Se.jpeg"></a></div>
-->
            <ul class="nav_menu">
            <li><a href="index.php">Home</a></li>
            <li><a href="GetFactors.php">GetFactors</a></li>
            <li><a href="SurpriseMe.php">Surprise Me</a></li>
<!--
            <li><a href="Login.php">Login</a></li>
-->
            <li><a href="Feedback.php">Feedback</a></li>
            <li><a href="About.html">About</a></li>
            </ul>
            <div class="clear"></div>
        </header>
        <br>
        <section id="mainBody">
			<div id="welcomeDiv">
			<h1>Welcome to Sean's website!</h1>
			<h2><a href="Chat.php">Chat</a></h2>
			</div>
            <div id="Login">
				<br>
				<form action="Login.php">
					<input type="submit" value="Login">
				</form>
				<br>
            </div>
            <div class="clear"></div>
            <div id="leftDiv">
<!--
				<p>leftDiv</p>
-->
            </div>
            <div id="rightDiv">
<!--
            <p>rightDiv</p>
-->
            </div>
        </section>

        <footer>Copyright Sean 2017<br><a href="Admin.php">Admin</a></footer>
    </div>
</body>
</html>
