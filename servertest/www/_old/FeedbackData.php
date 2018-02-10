<!DOCTYPE html>
<html>
<head>
<title>FeedBackData - Admin</title>
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
		echo "<h2>Feedback Data:</h2>";
		echo "<h3>Accessed by administrator ".$_SESSION["user"]."</h3>";
		$con = mysql_connect("localhost","root","haoxiang2002");
		if (!$con){
		  die("Could not connect: " . mysql_error());
		  }
		mysql_select_db("FeedbackData", $con);
		$result = mysql_query("SELECT * FROM data");
		while($row = mysql_fetch_array($result)){
			echo "Time: ".$row["time"] . " IP: " . $row["ip"]. " Data: " . $row["text"]."<br>";
		  }
		mysql_close($con);
		
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

</body>
</html>

