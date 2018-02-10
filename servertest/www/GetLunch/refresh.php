<!DOCTYPE html>
<html>

<head>
	<title>Refresh Menu</title>>
</head>

<body>
	<?php
	$res = shell_exec("sudo sh /var/www/html/update.sh");
	echo "Results: <br/><br/><pre>".$res."</pre>";
	?>
</body>

</html>
