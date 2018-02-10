<!DOCTYPE html>
<html>
<head>
<title>My Account</title>
<!--
<link rel="stylesheet" type="text/css" href="style.css">
-->
</head>

<body>
<?php
session_start();
if (isset($_SESSION["user"])==true){
	if (isset($_POST["delpasswd"])==true){//user wants to delete account
		if (isset($_POST["ask"])==true){//ask
			echo "<h1 style='color:red'>DELETE ACCOUNT?</h1>";
			echo "<h3>All data will be lost!</h3>";
			$delpasswd=$_POST["delpasswd"];
			?>
			<form action="" method="post">
				<input type="hidden" name="delpasswd" value="<?php echo $_POST["delpasswd"];?>">
				<input type="submit" style="color:red" value="YES">
			</form>
			<br>
			<form action="">
				<input type="submit" value="NO">
			</form>
			<?php
			exit;
		}else{//delete
			$con = mysql_connect("localhost","root","haoxiang2002");
			if (!$con){
				die('Could not connect: ' . mysql_error());
			}
			mysql_select_db("Users", $con);
			//check passwd
			$result = mysql_query("SELECT * FROM data WHERE BINARY username='".$_SESSION["user"]."'");
			$row = mysql_fetch_array($result);
			if ($row[1]!=$_POST["delpasswd"]){
				echo "<h1>Wrong Password</h1>"
				?>
				<form action="">
				<input type="submit" value="Try again">
				</form>
				<?php
			}
			$result=mysql_query("DELETE FROM data WHERE BINARY username='".$_SESSION["user"]."'");
			mysql_close($con);
			unset($_SESSION["user"]);
			echo "<h1>Operation Successful</h1><h3>Account is deleted</h3>";
		}
	}elseif (isset($_POST["oldpasswd"])==true){//change passwd
		if ($_POST["newpasswd"]!=$_POST["confirmpasswd"]){
			echo "<h1>Oops, your new password doesn't match the confirm</h1>";
			?>
			<form action="">
				<input type="submit" value="Try Again">
			</form>
			<?php
			exit;
		}
		//check passwd
		$con = mysql_connect("localhost","root","haoxiang2002");
			if (!$con){
				die('Could not connect: ' . mysql_error());
			}
			mysql_select_db("Users", $con);
			$result = mysql_query("SELECT * FROM data WHERE BINARY username='".$_SESSION["user"]."'");
			$row = mysql_fetch_array($result);
			if ($row[1]!=$_POST["oldpasswd"]){
				echo "<h1>Wrong Password</h1>";
				?>
				<form action="">
				<input type="submit" value="Try again">
				</form>
				<?php
				mysql_close($con);
				exit;
			}
			$result=mysql_query("UPDATE data SET passwd='".$_POST["newpasswd"]."' WHERE BINARY username='".$_SESSION["user"]."'");
			mysql_close($con);	
			echo "<h1>Password Reset Successful</h1>";
	}elseif (isset($_POST["adminpasswd"])==true){
		if (isset($_POST["ask"])==true){//be a admin - ask
			$con = mysql_connect("localhost","root","haoxiang2002");
				if (!$con){
					die('Could not connect: ' . mysql_error());
				}
				mysql_select_db("Users", $con);
				$result = mysql_query("SELECT * FROM data WHERE BINARY username='".$_SESSION["user"]."'");
				$row = mysql_fetch_array($result);
				mysql_close($con);
				$adminpassword="haoxiang2002";
					if ($_POST["adminpasswd"]==$adminpassword and $_POST["passwd"]==$row[1]){//password correct
						?>
						<h1 style="color:red">Attention - Read it first</h1>
						<h2>You are about to become an adminstrator of this website<br>Are you sure you want to do that?</h2>
						<h3>There are 3 things:</h3>
						<h4>1. Respect the privacy of others.<br>2. Think before you do something.<br>3. With great power comes great responsibility.</h4>
						<form action="" method="post">
							<input type="hidden" name="adminpasswd">
							<input type="submit" style="color:red" value="I UNDERSTAND AND CONTINUE">
						</form>
						<?php
					}else{//wrong passwd
						echo "<h1>Wrong Password</h1>";
							?>
							<form action="">
							<input type="submit" value="Try again">
							</form>
							<?php
							exit;
					}
		}else{//be a admin
			$con = mysql_connect("localhost","root","haoxiang2002");
			if (!$con){
				die('Could not connect: ' . mysql_error());
			}
			mysql_select_db("Users", $con);
			$result=mysql_query("UPDATE data SET admin='1' WHERE BINARY username='".$_SESSION["user"]."'");
			mysql_close($con);	
			echo "<h1>Success</h1><h2>You are now an administrator of this website</h2>";
		}
	}elseif (isset($_POST["signout"])==true){
		unset($_SESSION["user"]);
		echo "<h1>You are now signed out</h1>";
	}else{//display main UI
		$con = mysql_connect("localhost","root","haoxiang2002");
			if (!$con){
				die('Could not connect: ' . mysql_error());
			}
			mysql_select_db("Users", $con);
			$result = mysql_query("SELECT * FROM data WHERE BINARY username='".$_SESSION["user"]."'");
			$row = mysql_fetch_array($result);
			
	echo "<h1>My Account</h1>";
	echo "<h3>Welcome, ".$_SESSION["user"]."</h3>";
	echo "<p>What would you like to do?</p>";
	?>
	<div class="container">
		<form action="" method="post">
			<input type="hidden" name="signout">
			<p><input type="submit" value="Sign Out"></p>
		</form>
	</div>
	<?php
	//check if remembered this device
			$con = mysql_connect("localhost","root","haoxiang2002");/////////////////////////////////////////////////////////////////////not finished
			if (!$con){
				die('Could not connect: ' . mysql_error());
			}
			mysql_select_db("Users", $con);
			$result = mysql_query("SELECT * FROM data WHERE BINARY username='".$_SESSION["user"]."'");
			$row = mysql_fetch_array($result);
			if ($row[1]!=$_POST["oldpasswd"]){
				echo "<h1>Wrong Password</h1>";
				?>
				<form action="">
				<input type="submit" value="Try again">
				</form>
				<?php
				mysql_close($con);
				exit;
			}
			$result=mysql_query("UPDATE data SET passwd='".$_POST["newpasswd"]."' WHERE BINARY username='".$_SESSION["user"]."'");
			mysql_close($con);	
			echo "<h1>Password Reset Successful</h1>";
	?>
	<div class="container">
		<form action="" method="post">
			<h4>Remember me on this device</h4>
			<p>Password:<input type="password" name="oldpasswd" required></p>
			<p><input type="submit" value="Remember Me"></p>
		</form>
	</div>
	<div class="container">
		<form action="" method="post">
			<h4>Change Password</h4>
			<input type="hidden" name="ask">
			<p>Old Password:<input type="password" name="oldpasswd" required></p>
			<p>New Password:<input type="password" name="newpasswd" required></p>
			<p>New Password Confirm:<input type="password" name="confirmpasswd" required></p>
			<p><input type="submit" value="Change Password"></p>
		</form>
	</div>
	<div class="container">
		<form action="" method="post">
			<h4>Delete Account</h4>
			<input type="hidden" name="ask">
			<p>Password:<input type="password" name="delpasswd" required></p>
			<p><input type="submit" value="Delete Account"></p>
		</form>
	</div>
		<div class="container">
		<form action="" method="post">
			<h4>Be an admin</h4>
			<input type="hidden" name="ask">
			<p>Password:<input type="password" name="passwd" required></p>
			<p>Admin Password:<input type="password" name="adminpasswd" required></p>
			<p><input type="submit" value="Become an admin"></p>
		</form>
	</div>
	<h4>You are signed up on <?php echo $row[2];?></h4>
<?php
	}
}else{
?>
<h1>Oops, you are not signed in</h1>
<h3>Click here to <a href="Login.php">Sign In</a></h3>
<?php
}
?>
<br>
<form action="index.php">
	<input type="submit" value="Home">
</form>

</body>
</html>
