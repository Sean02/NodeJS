#!/usr/bin/env python

import cgitb
import time

cgitb.enable()

print ("Content-Type: text/html")
print("")
print("<h1>HelloWorld from Python!</h1>")
print("")
print("<h4>The date & time is:  "+("%s" %time.strftime("%m-%d-%Y"))+"  "+("%s" %time.strftime("%H:%M:%S"))+"<h4>")
