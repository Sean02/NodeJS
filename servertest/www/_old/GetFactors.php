<!DOCTYPE html>
<html>
<head>
<title>GetFactors</title>
</head>

<body>
	
<?php
if (isset($_GET["n"])==true){
	$n=intval($_GET["n"]);
	if ($n<=0){
		echo "<h1>Oops: '".$_GET["n"]."' is not a integer > 0</h1>";
		?>
		<form action="">
			<input type="submit" value="Try again">
		</form>
		<?php
	}else{
		echo "<h2>Showing Factors for ".$n.":</h2>";
		$ans="";
		for ($i=1;$i<=($n/2)+1;$i++){
			if (fmod($n,$i)==0){
				$ans=$ans.strval($i)."   ";
			}
		}
		echo "<p>".$ans.strval($n)."</p><br><br>";
		?>
		<form action="">
			<input type="submit" value="Go Back">
		</form>
		<?php
	}
}else{
?>
	
<h5>Enter the number you want to get the factors of: </h5>
<form action="" method="get">
	<input type="text" name="n">
	<input type="submit" value="Calculate">
</form>

<?php
}
?>
</br>
</br>

<form action="index.php">
	<input type="submit" value="Home">
</form>
</body>
</html>
