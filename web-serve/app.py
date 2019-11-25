'''

Adapted excerpt from Getting Started with Raspberry Pi by Matt Richardson

Modified by Pablo Ortiz add request api-rest
Complete project details: http://randomnerdtutorials.com

'''

import RPi.GPIO as GPIO
from flask import Flask, render_template, request
import requests
import json
import time
import datetime
app = Flask(__name__)


GPIO.setmode(GPIO.BCM)

time_string = '2018-07-16T23:50:55+0000'

#Reduct 8 hours and print in human readable format
struct_time = time.strptime(time_string, "%Y-%m-%dT%H:%M:%S+0000")
t = datetime.datetime(*struct_time[:6])
delta = datetime.timedelta(hours=8)
print(t+delta)

# Create a dictionary called pins to store the pin number, name, and pin state:
pins = {
   23 : {'name' : 'GPIO 23', 'state' : GPIO.LOW},
   24 : {'name' : 'GPIO 24', 'state' : GPIO.LOW}
   }

random = {
   {'id': t 'title' : 'GPIO 23', 'date' : t+delta},
   }

# Set each pin as an output and make it low:
for pin in pins:
   GPIO.setup(pin, GPIO.OUT)
   GPIO.output(pin, GPIO.LOW)

@app.route("/")
def main():
   # For each pin, read the pin state and store it in the pins dictionary:
   for pin in pins:
      pins[pin]['state'] = GPIO.input(pin)
   # Put the pin dictionary into the template data dictionary:
   templateData = {
      'pins' : pins
      }
   # Pass the template data into the template main.html and return it to the user
   return render_template('main.html', **templateData)

@app.route('/list')
def list():
   r = requests.get('https://todo-ylmfpvu27a-uc.a.run.app/list')
   print(r.text)
   return render_template('firestore.html', movies=json.loads(r.text))

@app.route('/add')
def add():
   #r = requests.get('https://todo-ylmfpvu27a-uc.a.run.app/list')
   #print(r.text)
   #return render_template('add.html', movies=json.loads(r.text))
   templateData = {'prueba' : random}
   return render_template('add.html', **templateData)


# The function below is executed when someone requests a URL with the pin number and action in it:
@app.route("/<changePin>/<action>")
def action(changePin, action):
   # Convert the pin from the URL into an integer:
   changePin = int(changePin)
   # Get the device name for the pin being changed:
   deviceName = pins[changePin]['name']
   # If the action part of the URL is "on," execute the code indented below:
   if action == "on":
      # Set the pin high:
      GPIO.output(changePin, GPIO.HIGH)
      # Save the status message to be passed into the template:
      message = "Turned " + deviceName + " on."

   if action == "off":
      GPIO.output(changePin, GPIO.LOW)
      message = "Turned " + deviceName + " off."

   # For each pin, read the pin state and store it in the pins dictionary:
   for pin in pins:
      pins[pin]['state'] = GPIO.input(pin)

   # Along with the pin dictionary, put the message into the template data dictionary:
   templateData = {
      'pins' : pins
   }

   return render_template('main.html', **templateData)

if __name__ == "__main__":
   app.run(host='0.0.0.0', port=80, debug=True)