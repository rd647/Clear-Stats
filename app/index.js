console.log('Hello world!');
import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { today } from 'user-activity';
import * as util from "../common/utils";
import { battery } from "power";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const mainTime = document.getElementById("mainTime");
const dayOfWeek = document.getElementById("dayOfWeek");
const myDay = document.getElementById("myDay");
const mySteps = document.getElementById("steps");
const myBattery = document.getElementById("battery");
const stepLabel = document.getElementById("stepLabel");

myBattery.text = Math.floor(battery.chargeLevel) + "%";
battery.onchange = function() {
	myBattery.text = Math.floor(battery.chargeLevel) + "%";
}
stepLabel.text = "steps";

let hrLabel = document.getElementById("hrm");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;

  let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  let day = days[today.getDay()];
  let numday = Math.floor(today.getDate());

  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  let ampm = "am";
  if (today.getHours() > 11) {
  	ampm = "pm";
  }
  dayOfWeek.text = `${day} ${numday}`;
  mainTime.text = `${hours}:${mins}`;
  mySteps.text = today.adjusted.steps;
  // myDay.text = `${numday}`;
  // dayOfWeek.text = `${ampm}`;
}

hrLabel.text = "--";

// Create a new instance of the HeartRateSensor object
var hrm = new HeartRateSensor();

// Declare an event handler that will be called every time a new HR value is received.
hrm.onreading = function() {
  // Peek the current sensor values
  console.log("Current heart rate: " + hrm.heartRate);
  hrLabel.text = hrm.heartRate;
}

// Begin monitoring the sensor
hrm.start();

