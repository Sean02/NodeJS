<!DOCTYPE html>
<html>
<head>
<title>Login</title>
</head>

<body>

<?php
session_start();
//~ if (isset($_COOKIE["username"])){
	//~ echo "smell cookie";
	//~ }
if (isset($_POST["username"])==true) {
	$con = mysql_connect("localhost","root","haoxiang2002");
	if (!$con)
	  {
	  die("Could not connect: " . mysql_error());
	  }
	
	mysql_select_db("Users", $con);
	
	$result = mysql_query("SELECT * FROM data WHERE BINARY username='".$_POST["username"]."' and passwd='".$_POST["passwd"]."'");
	$user = mysql_fetch_array($result);
	mysql_close($con);
	if ($user){
		//log in
		if (!empty($_POST["remember"])){
			setcookie ("username", $_POST["username"],time()+(10*365*24*60*60));
			setcookie ("passwd", $_POST["passwd"],time()+(10*365*24*60*60));
			//echo "cookie set";
		}else{ //destory cookie
			if (isset($_COOKIE["username"])){
				setcookie ("username","",1); //set cookie expire time to year 1970
			}
			if (isset($_COOKIE["passwd"])){
				setcookie ("passwd","",1); //set cookie expire time to year 1970
			}
			//echo "cookie destory";
		}
		$_SESSION["user"]=$_POST["username"];
		
		echo "<h1>Hello, ".$_SESSION["user"]."</h1>";
		echo "<h2>You are now signed in</h2>";
		echo "<p>Click here to <a href='MyAccount.php'>manage account</a></p>"
		?>
		<br>
		<form action="index.php">
			<input type="submit" value="Home">
		</form>
		<?php
		exit;
	}else{//invalid user
		$msg = "Invalid User";
		
	}
	
}
	if (isset($_SESSION["user"])==true){
		echo "<h1>Signed In</h1>";
		echo "<p>Signed in as [<a href='MyAccount.php' style='color:blue;'>".$_SESSION["user"]."</a>]</p>";
	}else{
		echo "<h1>Sign In</h1>";
	}
	
	if (isset($msg)){
		echo"<p style='color:red;'>".$msg."</p>";
	}
	?>
	<form action="" method="post">
		<p>Username: <input type="text" name="username" value="<?php if (isset($_COOKIE["username"])){echo $_COOKIE["username"];}?>" required></p>
		<p>Password: <input type="password" name="passwd" value="<?php if (isset($_COOKIE["passwd"])){echo $_COOKIE["passwd"];}?>" required></p>
		<p><input type="checkbox" name="remember" <?php if (isset($_COOKIE["username"])){ ?> checked <?php } ?>> Remember Me</p>
		<input type="submit">
	</form>
	<br><br>
	<form action="index.php">
		<input type="submit" value="Home">
	</form>

<br>
<footer>Don't have an account? <a href="Register.php">Sign up</a> now!</footer>
</body>
</html>
