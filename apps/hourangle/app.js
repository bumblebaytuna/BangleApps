// ------------------------------------------
// -------- Settings Read-Write Functions --------
// ------------------------------------------

// Load Settings function
function loadSettings() {
  
  // return the requested key value
  return Object.assign(
    {},                 // ensure a new object
    DEFAULTS,           // if the field is empty it reads the global defaults first
    require("Storage").readJSON(STORAGE_FILE, true) || {}
  );
}

// Save Settings function
function saveSettings() {require("Storage").writeJSON(STORAGE_FILE, mySettings);}

// ------------------------------------------
// ---- Settings Menu Creation Functions ----
// ------------------------------------------

// Create Root Menu
function showRootMenu() {
  
  E.showMenu({
    "": { "title": "Hour Angle" },
    "< Back": () => load(), // using load() always shows the watch's main menu
    "Run": loadMainApp,
    "Settings": showMainSettingsMenu
  //showMenu closure brackets
  });
//function closure bracket
}

// Create Main Settings Menu
function showMainSettingsMenu() {
 
  E.showMenu({
    //common parts
    "": { "title": "Settings" },
    "< Back": () => showRootMenu(), 
    //custom parts
    "useGPS": {
      value: !!mySettings.useGPS,
      format: v => v ? true : false, // forces Boolean/Checkbox use
      onchange: v => {
        mySettings.useGPS = v;
        saveSettings();
      }
    },
    "Brightness": {
      value: Number(mySettings.brightness),
      min: 0,
      max: 7,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.brightness = v;
        saveSettings();
      }
    },
    "Reticule Style": {
      value: Number(mySettings.reticuleStyle),
      options: {1: "Takahashi",2: "Move-Shoot-Move"},
      onchange: v => {
        mySettings.reticuleStyle = v;
        saveSettings();
      }  
    },
    
    "Reticule Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu

    "Reticule End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    
    "Longitude Direction": {
      value: Number(mySettings.lonDirection),
      options: {1: "East",2: "West"},
      onchange: v => {
        mySettings.lonDirection = v;
        saveSettings();
      }
    },
    
    "Longitude Angle": showLongitudeAngleMenu, // Opens nested submenu
    
    //common parts
    "Version": {value: mySettings.swVersion}, //read only
    "Reset (immediate)": () => {
      mySettings = { theme: DEFAULTS.theme, vibration: DEFAULTS.vibration, brightness: DEFAULTS.brightness, advancedOption: DEFAULTS.advancedOption };
      saveSettings();
      Bangle.setLCDBrightness(mySettings.brightness);
      E.showMessage("Settings reset!");
    }
  //showMenu closure brackets
  });
//function closure bracket
}


// Create Nested Longitude Angle submenu
function showLongitudeAngleMenu() {
  
  // create the number for the title
  let lonangle = getLongitudeAngle();
  
  E.showMenu({
    //common parts
    "": { "title": "Longitude: " + lonangle + "°" },
    "< Back": showMainSettingsMenu(),
    //custom parts
    "Hundreds": {
      value: Number(mySettings.lonAngleHundreds),
      min: 0,
      max: 1,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.lonAngleHundreds = v;
        saveSettings();
        showLongitudeAngleMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(mySettings.lonAngleTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.lonAngleTens = v;
        saveSettings();
        showLongitudeAngleMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(mySettings.lonAngleOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.lonAngleOnes = v;
        saveSettings();
        showLongitudeAngleMenu(); // redraw menu so it updates the title
      }
    }
  //menu closure brackets
  });
//function closure bracket
}

// Create Nested Reticule Validity Start Year submenu
function showReticuleValidityStartYearMenu() {
  
  // create the number for the title
  let validityStartYear = getReticuleValidityStartYear();
  
  E.showMenu({
    //common parts
    "": { "title": "Start Year: " + validityStartYear + "°" },
    "< Back": showMainSettingsMenu(),
    //custom parts
    "Thousands": {
      value: Number(mySettings.reticuleValidityStartYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.reticuleValidityStartYearThousands = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(mySettings.reticuleValidityStartYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.reticuleValidityStartYearHundreds = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(mySettings.reticuleValidityStartYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.reticuleValidityStartYearTens = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(mySettings.reticuleValidityStartYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.reticuleValidityStartYearOnes = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    }
  //menu closure brackets
  });
//function closure bracket
}

// ------------------------------------------
// --- Settings Digit Combiner Functions ----
// ------------------------------------------

// Create longitude angle digits combiner
function getLongitudeAngle() {
  return ((Number(mySettings.lonAngleHundreds) * 100) + (Number(mySettings.lonAngleTens) * 10) + Number(mySettings.lonAngleOnes));
}

// Create reticule validity start year digits combiner
function getReticuleValidityStartYear() {
  return ((Number(mySettings.reticuleValidityStartYearThousands) * 100) + (Number(mySettings.reticuleValidityStartYearHundreds) * 100) + (Number(mySettings.reticuleValidityStartYearTens) * 10) + Number(mySettings.reticuleValidityStartYearOnes));
}

// Create reticule validity end year digits combiner
function getReticuleValidityEndYear() {
  return ((Number(mySettings.reticuleValidityEndYearThousands) * 100) + (Number(mySettings.reticuleValidityEndYearHundreds) * 100) + (Number(mySettings.reticuleValidityEndYearTens) * 10) + Number(mySettings.reticuleValidityEndYearOnes));
}


// ------------------------------------------
// -------- GPS Control Functions --------
// ------------------------------------------

function startWaitingForGPS() {
  // draw immediately
  showWaitingForGPS(mySettings.reticuleColour);

  // refresh every 1 second
  waitingPageIntervalID = setInterval(() => {
    if (!gpsFixReceived) {
      showWaitingForGPS(mySettings.reticuleColour);
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
    gpsYear = gpsTime.getFullYear();
    gpsMonth = gpsTime.getMonth()+1;
    gpsDay = gpsTime.getDate();
    gpsHour = gpsTime.getHours();
    gpsMinute = gpsTime.getMinutes();
    gpsSecond = gpsTime.getSeconds();

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
    lon: mySettings.lonDegrees,                // fake longitude
    time: new Date(),       // must be a Date object
    satellites: 7
  };
  Bangle.emit("GPS", fakeFix);
}


// ------------------------------------------
// -------- Common Drawing Functions --------
// ------------------------------------------


function drawCircle(cx, cy, r, circleColour) {

  // Remember old colour
  let oldColour = g.getColor();

  // Set new colour
  g.setColor(circleColour);

  // Draws a circle
  let x = 0;
  let y = r;
  let d = 3 - 2 * r;

  function plotPoints(cx, cy, x, y) {
    g.setPixel(cx + x, cy + y);
    g.setPixel(cx - x, cy + y);
    g.setPixel(cx + x, cy - y);
    g.setPixel(cx - x, cy - y);
    g.setPixel(cx + y, cy + x);
    g.setPixel(cx - y, cy + x);
    g.setPixel(cx + y, cy - x);
    g.setPixel(cx - y, cy - x);
  }

  while (y >= x) {
    plotPoints(cx, cy, x, y);
    x++;

    if (d > 0) {
      y--;
      d += 4 * (x - y) + 10;
    } else {
      d += 4 * x + 6;
    }
  }

  // Restore old colour
  g.setColor(oldColour);

}


function drawFilledCircle(cx, cy, r, circleColour) {
  // Draws a filled circle

  // Remember old colour
  let oldColour = g.getColor();

  // Set new colour
  g.setColor(circleColour);
  
  let x = 0;
  let y = r;
  let d = 3 - 2 * r;

  function drawSpans(cx, cy, x, y) {
    // Draw horizontal spans instead of single pixels
    g.drawLine(cx - x, cy + y, cx + x, cy + y);
    g.drawLine(cx - x, cy - y, cx + x, cy - y);
    g.drawLine(cx - y, cy + x, cx + y, cy + x);
    g.drawLine(cx - y, cy - x, cx + y, cy - x);
  }

  while (y >= x) {
    drawSpans(cx, cy, x, y);
    x++;

    if (d > 0) {
      y--;
      d += 4 * (x - y) + 10;
    } else {
      d += 4 * x + 6;
    }
  }

  // Restore old colour
  g.setColor(oldColour);

}


function drawDottedLine(x0, y0, x1, y1, dotSpacing, thickness, lineColour) {
  // Draws a dotted line with thickness
  // color = "#html", dotSpacing = pixels between dots, thickness = thickness of the line

  // Remember old colour
  let oldColour = g.getColor();

  // Set new colour
  g.setColor(lineColour);

  let dx = x1 - x0;
  let dy = y1 - y0;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let steps = Math.floor(distance / dotSpacing);

  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let x = Math.round(x0 + dx * t);
    let y = Math.round(y0 + dy * t);

    // Draw the pixels to simulate thickness
    for (let offsetX = -Math.floor(thickness / 2); offsetX <= Math.floor(thickness / 2); offsetX++) {
      for (let offsetY = -Math.floor(thickness / 2); offsetY <= Math.floor(thickness / 2); offsetY++) {
        g.setPixel(x + offsetX, y + offsetY);
      }
    }
  }

  // Restore old colour
  g.setColor(oldColour);
}

function drawCustomLine(x0, y0, x1, y1, lineColour) {

  // Remember old colour
  let oldColour = g.getColor();

  // Set new colour
  g.setColor(lineColour);

  // Draws a line
  g.drawLine(x0, y0, x1, y1);

  // Restore old colour
  g.setColor(oldColour);

}



function drawNumberAtAngle(cx, cy, radius, number, angle_deg, xoffset, yoffset, labelColour) {
  // draw number labels
  // Function to display number at a specific angle on the circle
  // Convert angle_deg to radians for the circle (0° at 6 o'clock)
  // xoffset and yoffset refines the position of the text (in pixels)

  // Remember old colour
  let oldColour = g.getColor();

  // Set new colour
  g.setColor(labelColour);
 
  let angle = (90 - angle_deg) * Math.PI / 180;  // Anti-clockwise angle

  // Calculate x and y position based on polar coordinates
  let x = cx + Math.round(radius * Math.cos(angle));
  let y = cy + Math.round(radius * Math.sin(angle));

  // Set the font size (you can adjust the font size if needed)
  let fontsize = 12;
  g.setFont("Vector",fontsize);  // Use a small, fixed-size font

  // Adjust the x and y positions to center the text
  let xCentered = x + xoffset;  // Adjust x to center horizontally
  let yCentered = y; // Adjust y to center vertically

  // Invert the y-axis for the Bangle.js screen (y increases downward)
  yCentered = cy - (y - cy) - Math.round(fontsize / 2);
  
   yCentered = yCentered + yoffset;

  // Draw the number centrally at the calculated position
  g.drawString(number, xCentered, yCentered);

  // Restore old color
  g.setColor(oldColour);

}

// -------------------- Draw Polaris Mark on Circle --------------------

function drawPolarisMarkerCircle(cx, cy, radius, HA_deg, size, markerColour) {
  // Draws a filled circle version of the Polaris marker at the hour angle on a circle of given radius
  // cx,cy = center, radius = circle radius
  // color = [r,g,b] array, e.g., [0,1,0] for green

  // Remember old colour
  let oldColour = g.getColor();

  // Set new colour
  g.setColor(markerColour);

  // let angle = (HA_deg - 90) * Math.PI / 180; // 0 deg at top, clockwise rotation
  // let angle = (90 + HA_deg) * Math.PI / 180;  // 0° at 6 o'clock, anti-clockwise rotation
  let angle = (90 - HA_deg) * Math.PI / 180;  // anti-clockwise rotation from 6 o'clock
  let x = cx + Math.round(radius * Math.cos(angle));
  let y = cy + Math.round(radius * Math.sin(angle));

  // Draw marker
  drawFilledCircle(x, y, size, markerColour);

  // Restore old colour
  g.setColor(oldColour);

  // return marker circle coordinates
  return {x:x, y:y}; 
}

function drawOuterTicks(cx, cy, radius, numberofticks, ticklength, tickColour) {

  // Draw outer-style major ticks (like clock hour markers) on the outer circle
  
  // Remember old colour
  let oldColour = g.getColor();

  // Set new colour
  g.setColor(tickColour);
  
  for (let i = 0; i < numberofticks; i++) {

    // Skip drawing the ticks at angles 0, 90, 180, and 270 degrees so does not obstruct the text labels
    if (i === 0 || i === (numberofticks*1/4) || i === (numberofticks*2/4) || i === (numberofticks*3/4)) {
      continue;
    }
    let angle = (2 * Math.PI / numberofticks) * i;
    let x1 = cx + Math.round(radius * Math.cos(angle));              // start at circle edge
    let y1 = cy + Math.round(radius * Math.sin(angle));
    let x2 = cx + Math.round((radius + ticklength) * Math.cos(angle)); // extend outward
    let y2 = cy + Math.round((radius + ticklength) * Math.sin(angle));
    g.drawLine(x1, y1, x2, y2);
  }
  
  // Restore old colour
  g.setColor(oldColour);
  
}

function drawInnerTicks(cx, cy, radius, numberofticks, ticklength, tickColour) {

  // Draw outer-style major ticks (like clock hour markers) on the outer circle

  // Remember old colour
  let oldColour = g.getColor();

  // Set new colour
  g.setColor(tickColour);

  for (let i = 0; i < numberofticks; i++) {

    // Skip drawing the ticks at angles 0, 90, 180, and 270 degrees so does not obstruct the text labels
    if (i === 0 || i === (numberofticks*1/4) || i === (numberofticks*2/4) || i === (numberofticks*3/4)) {
      continue;
    }
    let angle = (2 * Math.PI / numberofticks) * i;
    let x1 = cx + Math.round(radius * Math.cos(angle));              // start at circle edge
    let y1 = cy + Math.round(radius * Math.sin(angle));
    let x2 = cx + Math.round((radius - ticklength) * Math.cos(angle)); // extend outward
    let y2 = cy + Math.round((radius - ticklength) * Math.sin(angle));
    g.drawLine(x1, y1, x2, y2);
  }

  // Restore old colour
  g.setColor(oldColour);

}

// Generate chosen Polarscope Reticules

function drawPolarscopeReticuleTakOrionSkyWatcher(cx, cy, reticuleColour, markerColour, reticuleValidityYearStart, reticuleValidityYearEnd, reticuleValidityCurrentYear, hourAngle) {

  // Remember old colour
  let oldColour = g.getColor();

  // Set new colour
  g.setColor(reticuleColour); 

  // Draw the outer circle and markers
  var outercircleradius = 67;     // circle radius
  drawCircle(cx, cy, outercircleradius, reticuleColour);
  drawOuterTicks(cx, cy, outercircleradius, 12, 8, reticuleColour);
  drawOuterTicks(cx, cy, outercircleradius, 72, 3, reticuleColour);

  // Draw the intermediate circle (no markers)
  var intermediatecircleradius = 57;     // circle radius
  drawCircle(cx, cy, intermediatecircleradius, reticuleColour);

  // Draw the inner circle and markers
  var innercircleradius = 47;     // circle radius
  drawCircle(cx, cy, innercircleradius, reticuleColour);
  drawInnerTicks(cx, cy, innercircleradius, 12, 8, reticuleColour);
  drawInnerTicks(cx, cy, innercircleradius, 72, 3, reticuleColour);

  // Draw vertical crosshair
  drawCustomLine(cx, 20, cx, 155, reticuleColour);   // top to bottom

  // Draw horizontal crosshair
  drawCustomLine(20, cy, 155, cy, reticuleColour);   // left to right

  // Draw the labels:
  var labelRadius = 80;     // label radius
  drawNumberAtAngle(cx, cy, labelRadius, "0", 180, -2, -1, reticuleColour);  // Display '0' at the 6 o'clock position
  drawNumberAtAngle(cx, cy, labelRadius, "6", 90, -5, 0, reticuleColour);  // Display '6' at the 3 o'clock position
  drawNumberAtAngle(cx, cy, labelRadius, "12", 0, -6, 2, reticuleColour);  // Display '12' at the 12 o'clock position
  drawNumberAtAngle(cx, cy, labelRadius, "18", 270, -6, 0, reticuleColour);  // Display '18' at the 9 o'clock position

  // Draw PHA marker
  let reticuleLifeUsed = (reticuleValidityCurrentYear-reticuleValidityYearStart)/(reticuleValidityYearEnd-reticuleValidityYearStart);
  console.log("Reticule Life Used =", reticuleLifeUsed.toFixed(2));
  let polarisMarkerReticuleRadius = innercircleradius+((outercircleradius-innercircleradius)*reticuleLifeUsed);
  let polarisMarker = drawPolarisMarkerCircle(cx, cy, polarisMarkerReticuleRadius, hourAngle, mySettings.polarisMarkerSize, markerColour);

  // Draw dotted line from center of reticule to the PHA marker
  drawDottedLine(cx, cy, polarisMarker.x, polarisMarker.y, 6, 2, markerColour);

  // Draw the central hub
  var hubradius = 3;     // circle radius
  drawFilledCircle(cx, cy, hubradius, reticuleColour);

  // Restore old colour
  g.setColor(oldColour);

}

function drawPolarscopeReticuleMoveShootMove(cx, cy, reticuleColour, markerColour, reticuleValidityYearStart, reticuleValidityYearEnd, reticuleValidityCurrentYear, hourAngle) {

  // Remember old colour
  let oldColour = g.getColor();

  // Set new colour
  g.setColor(reticuleColour);

  // Draw the outer circle (no markers)
  var outercircleradius = 67;     // circle radius
  drawCircle(cx, cy, outercircleradius, reticuleColour);

  // Draw the intermediate circle and markers
  var intermediatecircleradius = 57;     // circle radius
  drawCircle(cx, cy, intermediatecircleradius, reticuleColour);
  drawOuterTicks(cx, cy, intermediatecircleradius, 12, 5, reticuleColour);
  drawOuterTicks(cx, cy, intermediatecircleradius, 24, 2, reticuleColour);
  drawOuterTicks(cx, cy, intermediatecircleradius, 72, 1, reticuleColour);
  drawInnerTicks(cx, cy, intermediatecircleradius, 12, 5, reticuleColour);
  drawInnerTicks(cx, cy, intermediatecircleradius, 24, 2, reticuleColour);
  drawInnerTicks(cx, cy, intermediatecircleradius, 72, 1, reticuleColour);

  // Draw the inner circle (no markers)
  var innercircleradius = 47;     // circle radius
  drawCircle(cx, cy, innercircleradius, reticuleColour);

  // Draw vertical crosshair
  drawCustomLine(cx, 20, cx, 155, reticuleColour);   // top to bottom

  // Draw horizontal crosshair
  drawCustomLine(20, cy, 155, cy, reticuleColour);   // left to right

  // Draw the labels:
  var labelRadius = 80;     // label radius
  drawNumberAtAngle(cx, cy, labelRadius, "0", 180, -2, -1, reticuleColour);  // Display '0' at the 6 o'clock position
  drawNumberAtAngle(cx, cy, labelRadius, "6", 90, -5, 0, reticuleColour);  // Display '6' at the 3 o'clock position
  drawNumberAtAngle(cx, cy, labelRadius, "12", 0, -6, 2, reticuleColour);  // Display '12' at the 12 o'clock position
  drawNumberAtAngle(cx, cy, labelRadius, "18", 270, -6, 0, reticuleColour);  // Display '18' at the 9 o'clock position

  // Draw PHA marker
  let reticuleLifeUsed = (reticuleValidityCurrentYear-reticuleValidityYearStart)/(reticuleValidityYearEnd-reticuleValidityYearStart);
  console.log("Reticule Life Used =", reticuleLifeUsed.toFixed(2));
  let polarisMarkerReticuleRadius = innercircleradius+((outercircleradius-innercircleradius)*reticuleLifeUsed);
  let polarisMarker = drawPolarisMarkerCircle(cx, cy, polarisMarkerReticuleRadius, hourAngle, mySettings.polarisMarkerSize, markerColour);

  // Draw dotted line from center of reticule to the PHA marker
  drawDottedLine(cx, cy, polarisMarker.x, polarisMarker.y, 6, 2, markerColour);

  // Draw the central hub
  var hubradius = 3;     // circle radius
  drawFilledCircle(cx, cy, hubradius, reticuleColour);

  // Restore old colour
  g.setColor(oldColour);

}


// ---------------------------------------------------------------
// --------------------------- Astro Formulae --------------------
// ---------------------------------------------------------------

// --- Hour Angle Calculation ---
function polarisHourAngle(lon, dateObj) {
  let Y = dateObj.year;
  let M = dateObj.month;
  let D = dateObj.day + dateObj.hour/24 + dateObj.min/(24*60) + dateObj.sec/(24*3600);

  if (M <= 2) { Y -= 1; M += 12; }

  let A = Math.floor(Y/100);
  let B = 2 - A + Math.floor(A/4);

  let JD = Math.floor(365.25*(Y+4716)) + Math.floor(30.6001*(M+1)) + D + B - 1524.5;

  // Greenwich Sidereal Time in degrees
  let T = (JD - 2451545.0)/36525;
  let GST = 280.46061837 + 360.98564736629*(JD-2451545) + 0.000387933*T*T - T*T*T/38710000;
  GST = GST % 360;
  if (GST < 0) GST += 360;

  // Local Sidereal Time
  let LST = GST + lon;  // longitude east positive
  LST = LST % 360;
  if (LST < 0) LST += 360;

  // Polaris RA H 40.41°
  let polarisRA = 40.41;

  let HA = LST - polarisRA;
  if (HA < 0) HA += 360;
  return HA;
}



// -------------------------------------------------
// ----------- Main Control Functions ---------------
// -------------------------------------------------

// Main refresh function
function startRefreshLoop() {
  if (refreshStarted) return;

  refreshStarted = true;
  updateDisplay(); // draw immediately

  // refresh every reticuleRefreshIntervalMillisecs thereafter
  intervalID = setInterval(
    updateDisplay,
    mySettings.reticuleRefreshIntervalMillisecs
  );
}


// Main display update function
function updateDisplay() {

  // Declare global variables to store date and time components to use when drawing the polaris marker
  var myYear, myMonth, myDay, myHour, myMinute, mySecond;

   if (mySettings.useGPS == 1) {

    //use GPS date and time
    myYear = gpsYear;
    myMonth = gpsMonth;
    myDay = gpsDay;
    myHour = gpsHour;
    myMinute = gpsMinute;
    mySecond = gpsSecond;

  } else {

    //use offline date and time
    const now = new Date();
    myYear = now.getFullYear();
    myMonth = now.getMonth() + 1;
    myDay = now.getDate();
    myHour = now.getHours();
    myMinute = now.getMinutes();
    mySecond = now.getSeconds();

  }

  // Declare time date object
  let dateObj = {year:myYear, month:myMonth, day:myDay, hour:myHour, min:myMinute, sec:mySecond};

  // Get location longitude
  var lonDegrees = Number(getLongitudeAngle());
  
  // Calculate Polaris Hour Angle for current location & time
  let HA = polarisHourAngle(lonDegrees, dateObj);
  console.log("Polaris Hour Angle =", HA.toFixed(2), "degrees");

  //set the reticule centre point
  var cx = 90;         // reticule centre x
  var cy = 88;         // reticule centre y

  // Clean the display
  g.setColor(mySettings.backgroundColour);
  g.clear();

  // Set the reticule colour based on the current theme (dark or light mode)
  if (g.theme.dark) {
    // Dark theme is active
    console.log("Watch is using dark theme, setting reticule to white");
    mySettings.reticuleColour = "#FFFFFF"; // White reticule for dark mode
  } else {
    // Light theme is active
    console.log("Watch is using light theme, setting reticule to dark");
    mySettings.reticuleColour = "#000000"; // Black reticule for light mode
  }
  
  // Draw reticule in chosen style
  if (mySettings.reticuleStyle == 1) {
      drawPolarscopeReticuleTakOrionSkyWatcher(cx, cy, mySettings.reticuleColour, mySettings.polarisMarkerColour, mySettings.reticuleValidityYearStart, mySettings.reticuleValidityYearEnd, myYear, HA);
    } else {
      drawPolarscopeReticuleMoveShootMove(cx, cy, mySettings.reticuleColour, mySettings.polarisMarkerColour, mySettings.reticuleValidityYearStart, mySettings.reticuleValidityYearEnd, myYear, HA);
    }
  
  // Update screen
  g.flip();
  
}


// ---------------------------------------------------------------------
// ----------- Main Startup and Calculation Function -------------------
// ---------------------------------------------------------------------

// Main display update function
function loadMainApp() {
    // Trigger fake GPS events every 10 seconds - ENABLE FOR TESTING ONLY
  setInterval(fakeGPSEvent, 10000);
  
  // --- Offline mode: draw immediately if GPS is not used ---
  if (mySettings.useGPS == 0) {
    console.log("Offline mode, drawing reticule immediately");
    startRefreshLoop();  // this calls updateDisplay immediately and starts the refresh loop
  }
  
  // functions to run depending on GPS requirement
  if (mySettings.useGPS == 1) {
    console.log("GPS required, initialising the GPS...");
  
    Bangle.setGPSPower(1);  // Start GPS
    
    // Start listening for GPS events
    Bangle.on("GPS", onGPSEvent);
    
    // show waiting page
    startWaitingForGPS();
    
    gpsStartTime = new Date();  // GPS start time
  
    if (!gpsFixReceived) {
      console.log("Awaiting GPS fix...");
      showWaitingForGPS(mySettings.reticuleColour);
    }
  
    waitingIntervalID = setInterval(function() {
      if (!gpsFixReceived) {
        console.log("Awaiting GPS fix...");
        showWaitingForGPS(mySettings.reticuleColour);
      }
    }, mySettings.gpsfixWaitIntervalMillisecs);
  
    // Check if GPS fix is acquired and then update
    if (gpsFixReceived) {
      console.log("GPS fix acquired...");
      //startRefreshLoop();  // Immediately update and start refresh cycle once GPS fix is received
    }
  
    intervalID = setInterval(function() {
      if (gpsFixReceived) {
        //updateDisplay();  // Update every 30 seconds
      }
    }, mySettings.reticuleRefreshIntervalMillisecs);
  
  } else {
    // No GPS required, so update immediately
    console.log("GPS not required, running in offline mode.");
    startRefreshLoop();  // Update immediately without waiting for GPS and start refresh loop
  }
}

// ---------------------------------------------------------------------
// ----------- App Initialisation --------------------------------------
// ---------------------------------------------------------------------

// define the settings storage file on the watch, this is created and stored on the watch
const STORAGE_FILE = "hourangle.settings.json";

// sets default values in case settings file is missing or empty
const DEFAULTS = {
  lonAngleHundreds:0,  // default lon location is 0 degrees
  lonAngleTens:0,  // default lon location is 0 degrees
  lonAngleOnes:0,  // default lon location is 0 degrees
  lonDirection:1, // default is West. West = 1, east = 0
  useGPS:0, // default GPS use is disabled
  reticuleRefreshIntervalMillisecs:60000, // default app display refresh is every 60 secs
  gpsfixWaitIntervalMillisecs:10000, // default GPS first fix waiting interval between checks
  backgroundColour:"#FFFFFF", // default background colour is white
  reticuleColour:"#000000", // default polarscope reticule colour is black
  polarisMarkerColour:"#0277BD", // default polaris marker colour and line is a blue/green which works in both light and dark mode
  polarisMarkerSize:5, // default polaris marker size is 5
  reticuleValidityYearStart:2000, // default polarscope reticule validity period start is year 2000
  reticuleValidityYearEnd:2030, // default polarscope reticule validity period start is year 2030
  reticuleStyle:1, // default polarscope reticule style is 1 (for Takahashi, Orion, and Skywatcher mounts)
  reticuleValidityStartYearThousands:2,  // default reticule validity start year is 2000
  reticuleValidityStartYearHundreds:0,  // default reticule validity start year is 2000
  reticuleValidityStartYearTens:0,  // default reticule validity start year is 2000
  reticuleValidityStartYearOnes:0,  // default reticule validity start year is 2000
  reticuleValidityEndYearThousands:2,  // default reticule validity end year is 2030
  reticuleValidityEndYearHundreds:0,  // default reticule validity end year is 2030
  reticuleValidityEndYearTens:3,  // default reticule validity end year is 2030
  reticuleValidityEndYearOnes:0,  // default reticule validity end year is 2030
  theme: "dark", // test defaults to check settings menu structure is working properly
  vibration: false, // test defaults to check settings menu structure is working properly
  brightness: 6, // test defaults to check settings menu structure is working properly
  advancedOption: false, // test defaults to check settings menu structure is working properly
  swVersion: "0.27" // version of this software
};

// Collects the global app settings from the storage file, the loadSettings() function uses the above defaults if the settings file is missing or empty
let mySettings = loadSettings();

// Declare global runtime variables
let intervalID;
let waitingIntervalID;
let gpsStartTime = null; // Holds the stopwatch counter (counts-up) value when waiting for the GPS to get a fix
let gpsFixReceived = false;  // Global flag to track if GPS fix is received
let refreshStarted = false;  // Global flag to track if the cyclic display refresh is active
let waitingPageIntervalID;  // for GPS waiting page

// Declare global runtime variables to store the GPS date and time components
var gpsYear, gpsMonth, gpsDay, gpsHour, gpsMinute, gpsSecond;

// MAIN APP START - Register the app in Bangle.js menu
//E.showMenu({
//  "": { "title": "Hour Angle" },
//  "Run": loadMainApp,
//  "Settings": showMainSettingsMenu
//});
showRootMenu();

// MAIN FEATURE START (Put inside a function)


// Cleanup on app exit
// Cleans up the IntervalID, waitingIntervalID and turns off the GPS
Bangle.on("kill", () => {
  if (intervalID) clearInterval(intervalID);
  if (mySettings.useGPS == 1) {
    Bangle.setGPSPower(0);
    //Bangle.removeListener("GPS", onGPS);
  }
  if (waitingIntervalID) clearInterval(waitingIntervalID);
});
