// settingsadjuster.js

let ctx;

// Called once by main app
exports.init = function (_ctx) {
  ctx = _ctx;
};

// -------------------------------------------------
// -------- GPS Manager: Declarations --------------
// -------------------------------------------------

let waitingPageIntervalID;  // for GPS waiting page
let gpsStartTime = null; // Holds the stopwatch counter (counts-up) value when waiting for the GPS to get a fix


// -------------------------------------------------
// -------- GPS Manager: Exports Control -----------
// -------------------------------------------------

//Define which functions are allowed to be accessed by other JS files/modules
//If they are not in the list below, they remain private for use by this file/module
exports.startWaitingForGPS = startWaitingForGPS;
exports.showWaitingForGPS = showWaitingForGPS;
exports.onGPSEvent = onGPSEvent;
exports.fakeGPSEvent = fakeGPSEvent;

// -------------------------------------------------
// -------- GPS Manager: Control Functions ----------
// -------------------------------------------------

function startWaitingForGPS() {
  // draw immediately
  showWaitingForGPS(ctx.mySettings.reticuleColour);

  // refresh every 1 second
  waitingPageIntervalID = setInterval(() => {
    if (!gpsFixReceived) {
      showWaitingForGPS(ctx.mySettings.reticuleColour);
    }
  }, 1000);
}

function stopWaitingForGPS() {
  if (waitingPageIntervalID) {
    clearInterval(waitingPageIntervalID);
    waitingPageIntervalID = null;
  }
}

function showWaitingForGPS(messageColour) {

  // Remember old colour
  let oldColour = g.getColor();

  // Set new colour
  g.setColor(messageColour);

  g.setColor("#FFFFFF"); // white background
  g.clear();

  g.setColor("#000000"); // black text
  g.setFont("Vector",20);
  g.drawString("Waiting for", 35, 50);
  g.drawString(" GPS fix...", 35, 72);


  // Get the current time and calculate elapsed time
  if (gpsStartTime) {
    let now = new Date();
    let elapsedTime = Math.floor((now - gpsStartTime) / 1000); // time in seconds
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = elapsedTime % 60;

    g.setFont("Vector", 16);
    g.drawString(
      "Time: " + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0"),
      35, 120
    );
  }

  // Restore old colour
  g.setColor(oldColour);

}

// Function to handle when GPS fix is received
function onGPSEvent(fix) {
  if (fix && fix.fix && fix.time) {
    gpsFixReceived = true;  // Mark GPS fix as received
    
    // Convert the GPS time from milliseconds since UNIX epoch to a Date object
    var gpsTime = fix.time instanceof Date ? fix.time : new Date(fix.time);
    
    // populate the global variables
    ctx.gpsYear = gpsTime.getFullYear();
    ctx.gpsMonth = gpsTime.getMonth()+1;
    ctx.gpsDay = gpsTime.getDate();
    ctx.gpsHour = gpsTime.getHours();
    ctx.gpsMinute = gpsTime.getMinutes();
    ctx.gpsSecond = gpsTime.getSeconds();

    console.log("----------");
    console.log("GPS event triggered:");
    console.log("Longitude = " + fix.lon);
    console.log("Time Stamp = " + gpsTime.toString()); // GPS timestamps are in millisecs since the Unix epoch
    console.log("Satellites = " + fix.satellites);
    console.log("----------");

    stopWaitingForGPS();   // ← STOP 1-sec waiting page refresh
    startRefreshLoop(); // Immediately refresh display once GPS fix is received
    return true;  // Return true to indicate GPS fix received
  }
  return false;  // Return false if no valid fix is received
}

// function to simulate a fake GPS fix - FOR TESTING PURPOSES ONLY
function fakeGPSEvent() {
  var fakeFix = {
    fix: 1,                 // indicate GPS fix
    lat: 50.9,              // fake latitude
    lon: ctx.mySettings.lonDegrees,                // fake longitude
    time: new Date(),       // must be a Date object
    satellites: 7
  };
  Bangle.emit("GPS", fakeFix);
}
