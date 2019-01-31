import * as burketools from "../common/burketools";

import document from "document";
//import { display } from "display";
//display.autoOff = false;
//display.on = true;

import { vibration } from "haptics";
import { memory } from "system";
import { BodyPresenceSensor } from "body-presence";

//DONE
import clock from "clock";
import { today, goals } from "user-activity";
import { battery, charger } from "power";
import { Accelerometer } from "accelerometer";
import { Barometer } from "barometer";
import { HeartRateSensor } from "heart-rate";
import { OrientationSensor } from "orientation";

// Update the clock every second
clock.granularity = "seconds";

// NOT USED ANYMORE regex for replacing the annoying .000 at the end of the timestring
// var re = new RegExp("(.000){1}");

let accel = new Accelerometer();
let bar = new Barometer({ frequency: 1 });
let hrm = new HeartRateSensor();
let orientation = new OrientationSensor({ frequency: 1 });

//vars for sensor data
var oriData1 = '';
var oriData2 = '';
var clkData1 = '';
var clkData2 = '';
var battData = '';
var chgData = '';
var stpData = '';


//get orientation sensor data
orientation.onreading = function(){
              oriData1 = "q0 = " + orientation.quaternion[0].toFixed(1) + ", q1 = " + orientation.quaternion[1].toFixed(1);
              oriData2 = "q2 = " + orientation.quaternion[2].toFixed(1) + ", q3 = " + orientation.quaternion[3].toFixed(1);
}

let firstscreen = true;

//get clock data
clock.ontick = (evt) =>{
  let today = evt.date;
  clkData1 = burketools.zeroPad(today.getMonth()+1) + '/' + burketools.zeroPad(today.getDate()) + '/' + today.getFullYear();
  clkData2 = burketools.zeroPad(today.getHours()) + ':' + burketools.zeroPad(today.getMinutes()) + ':' + burketools.zeroPad(today.getSeconds());
}

//accel.start();
//bar.start();
hrm.start();
//orientation.start();

// create variables that map to DOM elements for assigning later
//second screen (sensors)
//let accelLabel = document.getElementById("accel-label");
//let accelData = document.getElementById("accel-data");
//let barLabel = document.getElementById("bar-label");
//let barData = document.getElementById("bar-data");
//let orientLabel = document.getElementById("orient-label");
//let orientData1 = document.getElementById("orient-data1");
//let orientData2 = document.getElementById("orient-data2");


// default screen (user/useful data)
let hrmIcon = document.getElementById("hrm-label-icon");
let hrmLabel = document.getElementById("hrm-label");
let hrmData = document.getElementById("hrm-data");
let clockData1 = document.getElementById("clock-data1");
let clockData2 = document.getElementById("clock-data2");
let batteryData = document.getElementById("battery-data");
let chargeData = document.getElementById("charge-data");
let stepData = document.getElementById("step-data");


function refreshData() {
  
  battData = Math.floor(battery.chargeLevel) + "%";
  chgData = charger.connected ? "CHG:" : "BAT:";
  stpData = today.local.steps + "/" + goals.steps;
  
  let data = {
    accel: {
      x: accel.x ? accel.x.toFixed(1) : 0,
      y: accel.y ? accel.y.toFixed(1) : 0,
      z: accel.z ? accel.z.toFixed(1) : 0
    },
    bar: {
      pressure: bar.pressure ? parseInt(bar.pressure) : 0
    },
    hrm: {
      heartRate: hrm.heartRate ? hrm.heartRate : 0
    },
    ori1: {
      orient1: oriData1 ? oriData1 : 0
    },
    ori2: {
      orient2: oriData2 ? oriData2 : 0
    },
    clock1: {
      clk1: clkData1 ? clkData1 : 0
    },
    clock2: {
      clk2: clkData2 ? clkData2 : 0
    },
    battery: {
    batt: battData ? battData : 0
  },
    chg: {
    charge: chgData ? chgData : 0
  },
    stps: {
    steps: stpData ? stpData : 0
  }
  };
  
  // assigning the text on the display to the data
if(firstscreen == true){

  // Default screen: Smartwatch Data
  hrmData.text = data.hrm.heartRate;
  clockData1.text = data.clock1.clk1;
  clockData2.text = data.clock2.clk2;
  batteryData.text = data.battery.batt;
  chargeData.text = data.chg.charge;
  stepData.text = data.stps.steps;
  //accelLabel.text = "";
  //accelData.text = "";
  //barLabel.text = "";
  //barData.text = "";
  //orientLabel.text = "";
  //orientData1.text = "";
  //orientData2.text = "";
}
  else{
  // swipe up for Sensor data?
  hrmData.text = data.hrm.heartRate = "";
  clockData1.text = data.clock1.clk1 = "";
  clockData2.text = data.clock2.clk2 = "";
  batteryData.text = data.battery.batt = "";
  chargeData.text = data.chg.charge = "";
  stepData.text = data.stps.steps = "";
  accelLabel.text = "Accel:";
  accelData.text = "X:" + data.accel.x + " Y:" + data.accel.y + " Z:" + data.accel.z;
  barLabel.text = "BAR:";
  barData.text = data.bar.pressure/1000 + " kPa";
  orientLabel.text = "Orient:";
  orientData1.text = data.ori1.orient1; 
  orientData2.text = data.ori2.orient2; 
  }
};

refreshData();
setInterval(refreshData, 1000);
