<!DOCTYPE html>
<html>
<head>
<title>About</title>
</head>

<body>
<?php
session_start();
if (isset($_SESSION["user"])==true){//signed in
	$con = mysql_connect("localhost","root","haoxiang2002");
	if (!$con){
	  die("Could not connect: " . mysql_error());
	  }
	mysql_select_db("Users", $con);
	$result = mysql_query("SELECT * FROM data WHERE BINARY username='".$_SESSION["user"]."'");
	$row = mysql_fetch_array($result);
	if ($row["admin"]=="1"){///////access granted
		?>
		<form action="Terminal.php">
		<input type="submit" value="Access Server Terminal">
	</form>
	<br>
	<form action="FeedbackData.php">
		<input type="submit" value="View Feedback Data">
	</form>
		
		<?php
	}else{//access denied
		echo"<h1>PREMISSION DENIED</h1>";
	}
	
}else{
	echo"<h1>PREMISSION DENIED</h1>";
}
?>

<br>
<form action="index.php">
	<input type="submit" value="Home">
</form>
<footer>Become a <a href="MyAccount.php">admin</a></footer>
</body>
</html>
