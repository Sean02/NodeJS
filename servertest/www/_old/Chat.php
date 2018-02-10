<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Chat- <?php 
    session_start();
	if (isset($_SESSION["user"])==true){
	    echo $_SESSION["user"];
	}else{
	    echo "Not Sign In";
	}?></title>
    <link rel="stylesheet" type="text/css" href="ChatStyle.css">
</head>
<body>
    <?php
    session_start();
    if (isset($_SESSION["user"])==false){//not signed in or sign in expired
            echo "<h1>Oops, you are not signed in</h1>";
            echo "<p>Click here to <a href='Login.php'>sign in</a></p>";
            exit;
    }
    if (isset($_POST["text"])==true){
        $dbhost="localhost";
        $dbusername="root";
        $dbpasswd="haoxiang2002";
        $dbname="Chat";
        $time=date("Y-m-d H:i:s");
        $userip=$_SERVER["REMOTE_ADDR"];
        $text=strip_tags(stripslashes($_POST["text"]));
        //$_echoresult=false;
        //connect to database
        @mysql_connect($dbhost,$dbusername,$dbpasswd) or 
        die ("<h2>Oops, something went wrong: Could not connect to mySQL<br>Please try again later...</h2>");
        @mysql_select_db($dbname) or 
        die ("<h2>Oops, something went wrong: Database does not exist<br>Please try again later...</h2>");

        // connect
        $conn = new mysqli($dbhost, $dbusername, $dbpasswd,$dbname);
        
        // check if there was an error
        if ($conn->connect_error) {
            die("<h2>Oops, something went wrong: Failed to connect: " . $conn->connect_error."<br>Please try again later...</h2>");
            mysql_close($con);
        } 

        $sql = "INSERT INTO data (name, message, time, ip) VALUES ('".$_SESSION["user"]."', '".$text."', '".$time."', '".$userip."')";
        
        //check if there was an error
        if ($conn->query($sql) === false) {
            echo "<h2>Oops, something went wrong: " . $sql . "<br>" . $conn->error."<br>Please try again later...</h2>";
            mysql_close($con);
        }
        
        mysql_close($con);
        //SUCCESS
        //$echoresult=true;
    }//else{//if (isset($_POST["text"])==true)
        ?>
    <div class="chatContainer">
        
        <div class="chatHeader">
            <h3>Chat</h3>
        </div>
        
        <div class="chatMessages">
        <?php
        $dbhost="localhost";
        $dbusername="root";
        $dbpasswd="haoxiang2002";
        $dbname="Chat";
        $time=date("Y-m-d H:i:s");
        $userip=$_SERVER["REMOTE_ADDR"];
        $text=strip_tags(stripslashes($_POST["text"]));
        //$_echoresult=false;
        //connect to database
        @mysql_connect($dbhost,$dbusername,$dbpasswd) or 
        die ("<h2>Oops, something went wrong: Could not connect to mySQL<br>Please try again later...</h2>");
        @mysql_select_db($dbname) or 
        die ("<h2>Oops, something went wrong: Database does not exist<br>Please try again later...</h2>");

        // connect
        $conn = new mysqli($dbhost, $dbusername, $dbpasswd,$dbname);
        
        // check if there was an error
        if ($conn->connect_error) {
            die("<h2>Oops, something went wrong: Failed to connect: " . $conn->connect_error."<br>Please try again later...</h2>");
            exit;
        } 

		mysql_select_db("FeedbackData", $conn);
		$result = mysql_query("SELECT * FROM data");
		while($row = mysql_fetch_array($result)){
			//echo "Time: ".$row["time"] . " IP: " . $row["ip"]. " Data: " . $row["text"]."<br>";
			echo "<li class='cm'<b>".ucwords($row["name"])."</b> - ".$row["message"]."</li>";
		  }
		mysql_close($conn);
        ?>
        </div>
        
        <div class="chatBottom">
            
            <form action="" id="chatForm" method="post">
<!--                <input type="hidden" id="name" value="otherusername">-->
                <input type="text" id="text" name="text" value="" placeholder="Type your chat message here" required>
                <input type="submit" name="submit" value="Send">            
            </form>
        </div>
        
    </div>
<script>
    //~ 
    //~ $(function(){
        //~ $(document).on("submit","#chatForm",function(){
        //~ )
           //~ 
       //~ }) 
    //~ });
    //~ 
    //~ function sendMsg(){
		//~ var text = $.trim($("#text").val()); 
        //~ //var name = $.trim($("#name").val());
        //~ alert("sending messsage!");
        //~ $.post("",{text:text},function(data){
            //~ $(".chatMessages").append(data);
        //~ }
	//~ }
    //setInterval(function(){location.reload();},3000);
</script>
    <?php
  //  }
     ?>
    

</body>
</html>
