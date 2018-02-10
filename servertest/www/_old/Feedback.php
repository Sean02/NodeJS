<html>
<head>
<title>FaQ</title>
</head>

<body>
<!--
	<script>
	alert("This Page is not ready yet...");
	window.location="../index.php"
	</script>
-->

<?php
if (isset($_POST["txt"])==true){
	//database info vars
	$dbhost="localhost";
	$dbusername="root";
	$dbpasswd="haoxiang2002";
	$dbname="FeedbackData";
	$time=date("Y-m-d H:i:s");
	$userip=$_SERVER["REMOTE_ADDR"];
	//connect to database
	@mysql_connect($dbhost,$dbusername,$dbpasswd) or 
	die ("<h2>Oops, something went wrong: Could not connect to mySQL<br>Please try again later...</h2>");
	@mysql_select_db($dbname) or 
	die ("<h2>Oops, something went wrong: Database does not exist<br>Please try again later...</h2>");
	
	// connect
	$conn = new mysqli($dbhost, $dbusername, $dbpasswd,$dbname);
	// check if there was an error
	if ($conn->connect_error) {
	    die("<h2>Oops, something went wrong: Failed to connect: " . $conn->connect_error)."<br>Please try again later...</h2>";
	} 
	
	$sql = "INSERT INTO data (time, ip, text) VALUES ('".$time."', '".$userip."', '".$_POST["txt"]."')";
	//check if there was an error
	if ($conn->query($sql) === TRUE) {
	    echo "<h1>Feedback submitted</h1>";
	    echo "<h2>Thank you for your feedback!</h2>";
	} else {
	    echo "<h2>Oops, something went wrong: " . $sql . "<br>" . $conn->error."<br>Please try again later...</h2>";
	}
	mysql_close($conn);
}else{
	?>
	<h1>Feedbacks and Questions</h1>
	<h3>You can tell us just about anything...</h3>
	<form action="" method="post">
		<br>
		<textarea name="txt" cols="40" rows="5" style="width:500px; height:100px;" required></textarea>
		<input type="submit" value="Submit">
	</form>
	<?php
	echo "<p>FYI, your IP address(".$_SERVER["REMOTE_ADDR"].") will be submitted along with your feedback.</p>";
}?>
<br>


<form action="index.php">
	<input type="submit" value="Home">
</form>

</body>
</html>
