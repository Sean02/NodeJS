<!DOCTYPE html>
<html>
<head>
<title>Sign Up</title>
</head>

<body>

<?php
session_start();
if (isset($_POST["username"])==true) {
	if ($_POST["passwd"]!=$_POST["passwd1"]){
		echo "<h2>Oops, your password doesn't match the Confirm</h2>"
		?>
		<form action="">
			<input type="submit" value="Try Again">
		</form>
		<?php
		exit;
	}
		
	$con = mysql_connect("localhost","root","haoxiang2002");
	if (!$con)
	  {
	  die("Could not connect: " . mysql_error());
	  }
	
	mysql_select_db("Users", $con);
	
	$result = mysql_query("SELECT * FROM data");
	
	while($row = mysql_fetch_array($result))
	  {
		if ($row["username"]== $_POST["username"]){
		echo "<h2>Oops, this Username is already used! Try another one</h2>"
		?>
		<form action="">
			<input type="submit" value="Try Again">
		</form>
		<?php
		exit;
		}
	  }
	
	mysql_close($con);
	//ok, valid username, add user

	//database info vars
	$dbhost="localhost";
	$dbusername="root";
	$dbpasswd="haoxiang2002";
	$dbname="Users";
	$time=date("Y-m-d H:i:s");
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
	
	$sql = "INSERT INTO data (username,passwd,timeofreg,admin) VALUES ('$_POST[username]','$_POST[passwd]','$time','false')";
	//check if there was an error
	if ($conn->query($sql) === TRUE) {
		$_SESSION["user"]=$_POST["username"];
	    echo "<h1>Sign up Successful</h1>";
	    echo "<h2>You are now signed in</h2>";
	} else {
	    echo "<h2>Oops, something went wrong: " . $sql . "<br>" . $conn->error."<br>Please try again later...</h2>";
	}
	mysql_close($conn);
	 
}else{
	?>
	<h2>Sign Up</h2>
	<?php
	if (isset($_SESSION["user"])==true){
		echo "<p style='color:red;'>Current account [<a href='MyAccount.php' style='color:blue;'>".$_SESSION["user"]."</a>] will be signed out if you sign up again</p>";
	}
	?>
	<br>
	<form action="" method="post">
		<p>Username: <input type="text" name="username" required></p>
		<p>Password: <input type="password" name="passwd" required></p>
		<p>Confirm:  <input type="password" name="passwd1" required></p>
		<input type="submit">
	</form>
	<br>
<?php
}
?>
<br>
<form action="index.php">
	<input type="submit" value="Home">
</form>
<footer></footer>
</body>
</html>
