#!/usr/bin/env python
# -*- coding: UTF-8 -*-

# CGI处理模块
import cgi
import cgitb
import RPi.GPIO as GPIO
import time


print ("Content-Type: text/html")

print("""


<html>
<head>
<title>About</title>
</head>
<body>
""")
GPIO.setmode(GPIO.BCM)

# 创建 FieldStorage 的实例化
form = cgi.FieldStorage() 

# 获取数据
GPIOs = form.getvalue('s')
c = form.getvalue('c')

#test use only
#GPIOs="26.1,13.0,19.1"
#c=3

if GPIOs is None: #print help
    print ("""
<h1>Help</h1>

<h3>Example: 192.168.10.101/cgi/GPIO?s=13.1,19.0,26.1&c=1</h3>

<h4>s(set) Format: s=[GPIO pin] [on/off],[GPIO pin] [on/off],......</h4>

<p>Enter the GPIO pin and its state (1:on, 0:off)you want it to be (separate with dot(.)).</p>
<p>You can also set multiple pins at the same time, just separate each with a comma(,)</p>

<h4>c(cleanup) Format: Integer >= 0</h4>

<p>Program will cleanup GPIO after c seconds, don't mention c to disable cleanup</p>
<p>Note that HTML reply will be sent after GPIO cleanup which could create a timeout if c is too large</p><h1>Help:</h1>

""")

else: #

    #separate each pin
    g=GPIOs.split(",")
    for i in g:
        a=i.split(".")
        GPIO.setup(int(a[0]),GPIO.OUT)
        if a[1]=="1":
            GPIO.output(int(a[0]),True)
            print ("<h2> PIN "+a[0]+" -- HIGH</h2>")
        else: #  "0"
            GPIO.output(int(a[0]),False)
            print ("<h2> PIN "+a[0]+" -- LOW</h2>")

    print("<h2></h2>")

    if c is None:#disable cleanup
        print("<h2>GPIO cleanup DISABLED</h2>")
    else:#cleanup
        c=float(c)
        print("<h2>GPIO cleanup in "+str(c)+" seconds</h2>")
        time.sleep(c)
        GPIO.cleanup()
        print("<h2>GPIO cleanup SUCCESS</h2>")
        
print("""
</body>
</html>


""")
