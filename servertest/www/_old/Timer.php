<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Timer</title>
</head>
<body>


<!-- Display the countdown timer in an element -->
<p id="display"></p>

<script>
// Set the date we're counting down to
var countDownDate = new Date("Aug 19, 2017 15:58:30").getTime();

function updateTimer() {

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now an the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  var p = "";
  
  if (days>0){
      p = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  }else if (hours>0){
      p = hours + "h " + minutes + "m " + seconds + "s ";
  }else if (minutes>0){
      p = minutes + "m " + seconds + "s ";
  }else{
      p = seconds + "s ";
  }
  // Display the result in the element with id="demo"
  document.getElementById("display").innerHTML = p;

  // If the count down is finished, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("display").innerHTML = "EXPIRED";
  }
}
    var x =setInterval(updateTimer,1000);//default:update time every 1 sec
</script>
</body>
</html>