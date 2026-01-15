// --- Degrees to Radians conversion ---
function degToRad(deg) {
  return deg * Math.PI / 180;
}

function radToDeg(rad) {
  return rad * 180 / Math.PI;
}


// --- Jupiter Moons Position Calculation ---
function calculateJupiterMoonPositions(minsoffset) {
  // default the minutes offset (used to determine moons direction of motion) to 0
    if (minsoffset === undefined) {
    minsoffset = 0;
  }
  // Based on 'Astronomical Algorithms 2nd Edition, Jean Meeus
  
  // get the date parameters
  
  let now = new Date();  //datetime now
  let myYear = now.getFullYear();
  let myMonth = now.getMonth()+1;
  let myDay = now.getDate() + (now.getHours()/24) + (now.getMinutes()/(24*60)) + (minsoffset/(24*60)) + (now.getSeconds()/(24*60*60));
  
  //console.log("Input Y =", myYear);
  //console.log("Input M =", myMonth);
  //console.log("Input D =", myDay);

// ------ JD calculation -----
  
  // Meeus, Chapter 7. If the month number (M) is >2, leave the year (Y) and month (M) unchanged. If M = 1 or 2, replace Y with Y-1, and M with M+12. i.e. if the date is in Jan or Feb, it is considered the 13th or 14th month of the previous year
  if (myMonth <= 2) { myYear -= 1; myMonth += 12; }

  //console.log("Adjusted Y =", myYear);
  //console.log("Adjusted M =", myMonth);
  //console.log("Adjusted D =", myDay);
  
  // If converting from a Gregorian calendar, Calculate A and B as below
  let AA = Math.floor(myYear/100);
  let BB = 2 - AA + Math.floor(AA/4);
  //console.log("AA =", AA);
  //console.log("BB =", BB);

  // Calculate the Julian Day at that date and time
  let JD = Math.floor(365.25*(myYear+4716)) + Math.floor(30.6001*(myMonth+1)) + myDay + BB - 1524.5;
  console.log("JD =", JD);
  
  // Calculate the Julian Ephemeris Day at that date and time
  //deltaT validity from 2005-2050 only, Chapter 22
  let t = myYear - 2000;
  let deltaT = 62.92 + (0.32217*t) + (0.005589*(t*t));
  console.log("deltaT =", deltaT, " secs");
  let JDE = JD + (deltaT/86400);
  console.log("JDE =", JDE);
  
// ------- Jupiter Ephemeris Calculation -----
// ------- Lower accuracy version, Good enough to visually ID the moons
// Meeus, Chapter 43
  
  //calculate d. no of days (and decimals of a day) since Jan 1 2000 at 12h TD
  let d = JD - 2451545;
  //console.log("d =", d);
  
  //Calculate argument for long-period term in motion of Jupiter, a.k.a V. In decimal degrees.
  let V = 172.74 + (0.00111588*d);
  // Convert to a 0-360 degree angle
  V = V % 360;
  if (V < 0) V += 360;
  //console.log("V =", V);
  
  //Calculate the mean anomalies of Earth and Jupiter. In decimal degrees.
  let M = 357.529 + (0.9856003*d);
  // Convert to a 0-360 degree angle
  M = M % 360;
  if (M < 0) M += 360;
  
  let N = 20.020 + (0.0830853*d)+(0.329*Math.sin(degToRad(V)));
  // Convert to a 0-360 degree angle
  N = N % 360;
  if (N < 0) N += 360;
  
  //console.log("M =", M);
  //console.log("N =", N);
  
  //Calculate the difference between heliocentric longitudes of Earth and Jupiter. In decimal degrees.
  let J = 66.115+(0.9025179*d)-(0.329*Math.sin(degToRad(V)));
  // Convert to a 0-360 degree angle
  J = J % 360;
  if (J < 0) J += 360;
  //console.log("J =", J);
  
  //Calculate the equations of centre of Earth and Jupiter. In decimal degrees.
  let A = (1.915*Math.sin(degToRad(M)))+(0.020*Math.sin(degToRad(2*M)));
  let B = (5.555*Math.sin(degToRad(N)))+(0.168*Math.sin(degToRad(2*N)));
  let K = J + A - B;
  //console.log("A =", A);
  //console.log("B =", B);
  //console.log("K =", K);
  
  //Calculate the radius vector of Earth
  let R = 1.00014 - (0.01671*Math.cos(degToRad(M))) - (0.00014*Math.cos(degToRad(2*M)));
  //console.log("R =", R);
  
  //Calculate the radius vector of Jupiter
  let r = 5.20872 - (0.25208*Math.cos(degToRad(N))) - (0.00611 * Math.cos(degToRad(2*N)));
  //console.log("r =", r);
  
  //Calculate the Distance from Earth to Jupiter (delta symbol)
  let delta = Math.sqrt((r*r)+(R*R)-(2*r*R*Math.cos(degToRad(K))));
  //console.log("delta =", delta);
  
  //Calculate the phase angle of Jupiter. aka psi (trident symbol). The angle psi always lies between +/- 12 degrees.
  let psi = radToDeg(Math.asin(R*Math.sin(degToRad(K))/delta));
  //console.log("psi =", psi);
  
  //Calculate the heliocentric longitude of Jupiter based on J2000 epoch. In decimal degrees.
  let lambda = 34.35 + (0.083091*d) + 0.329*Math.sin(degToRad(V)) + B;
  //console.log("lambda =", lambda);
  
  //Calculate the planetocentric declination of Earth based on J2000 epoch. In decimal degrees.
  let Ds = 3.12*Math.sin(degToRad(lambda+42.8));
  let De = Ds - (2.22*Math.sin(degToRad(psi))*Math.cos(degToRad(lambda+22)))-(1.3*((r-delta)/delta)*Math.sin(degToRad(lambda-100.5)));
  //console.log("Ds =", Ds);
  //console.log("De =", De);
  
// ------- Jupiter Moonn Positions Calculation -----
// ------- Lower accuracy version, Good enough to visually ID the moons
// Meeus, Chapter 44

  // calculate the angle of the four main moons from their inferior conjunction with Jupiter
  
  let u1 = 163.8069 + (203.4058646*(d-(delta/173)))+psi-B;
  // Convert to a 0-360 degree angle
  u1 = u1 % 360;
  if (u1 < 0) u1 += 360;
  //console.log("u1 =", u1);
  
  let u2 = 358.4140 + (101.2916335*(d-(delta/173)))+psi-B;
  // Convert to a 0-360 degree angle
  u2 = u2 % 360;
  if (u2 < 0) u2 += 360;
  //console.log("u2 =", u2);
  
  let u3 = 5.7176 + (50.2345180*(d-(delta/173)))+psi-B;
  // Convert to a 0-360 degree angle
  u3 = u3 % 360;
  if (u3 < 0) u3 += 360;
  //console.log("u3 =", u3);
  
  let u4 = 224.8092 + (21.4879800*(d-(delta/173)))+psi-B;
  // Convert to a 0-360 degree angle
  u4 = u4 % 360;
  if (u4 < 0) u4 += 360;
  //console.log("u4 =", u4);
  
  // calculate the angle correction values G and H
  let G = 331.18 + (50.310482*(d-(delta/173)));
  let H = 87.45 + (21.569231*(d-(delta/173)));

  // apply the angle correction values to the moon angles
  u1 = u1 + 0.473*Math.sin(degToRad(2*(u1-u2)));
  u2 = u2 + 1.065*Math.sin(degToRad(2*(u2-u3)));
  u3 = u3 + 0.165*Math.sin(degToRad(G));
  u4 = u4 + 0.843*Math.sin(degToRad(H));
  //console.log("corrected u1 =", u1);
  //console.log("corrected u2 =", u2);
  //console.log("corrected u3 =", u3);
  //console.log("corrected u4 =", u4);
  
  //calculate distance of the moons from the centre of Jupiter, in units of Jupiter's equatorial radius.
  
  let r1 = 5.9057 - 0.0244*Math.cos(degToRad(2*(u1-u2)));
  let r2 = 9.3966 - 0.0882*Math.cos(degToRad(2*(u2-u3)));
  let r3 = 14.9883 - 0.0216*Math.cos(degToRad(G));
  let r4 = 26.3627 - 0.1939*Math.cos(degToRad(H));
  console.log("r1 =", r1);
  console.log("r2 =", r2);
  console.log("r3 =", r3);
  console.log("r4 =", r4);
  
  //calculate xy coordinates of the moons from the centre of Jupiter, in units of Jupiter's equatorial radius.
  
  let x1 = r1*Math.sin(degToRad(u1));
  let y1 = -r1*Math.cos(degToRad(u1))*Math.sin(degToRad(De));
  console.log("x1 =", x1);
  console.log("y1 =", y1);
  
  let x2 = r2*Math.sin(degToRad(u2));
  let y2 = -r2*Math.cos(degToRad(u2))*Math.sin(degToRad(De));
  console.log("x2 =", x2);
  console.log("y2 =", y2);
  
  let x3 = r3*Math.sin(degToRad(u3));
  let y3 = -r3*Math.cos(degToRad(u3))*Math.sin(degToRad(De));
  console.log("x3 =", x3);
  console.log("y3 =", y3);
  
  let x4 = r4*Math.sin(degToRad(u4));
  let y4 = -r4*Math.cos(degToRad(u4))*Math.sin(degToRad(De));
  console.log("x4 =", x4);
  console.log("y4 =", y4);
  
  return {
    moons : [
      { x:x1, y:y1 },
      { x:x2, y:y2 },
      { x:x3, y:y3 },
      { x:x4, y:y4 }
    ],
    maxOrbit : Math.max(r1, r2, r3, r4)
  };
}

function getJupiterMoonDirections() {
  
  // jitter guard
  const epsilon = 0.0001;

  // Calculate positions at the current time
  const currentPositions = moonsDataset01;

  // Calculate positions a few minutes later
  const futurePositions = moonsDataset02;

  // Create an array to store the results
  const results = [];

  // Loop through each moon
  for (let i = 0; i < currentPositions.moons.length; i++) {

    const currentMoon = currentPositions.moons[i];
    const futureMoon = futurePositions.moons[i];

    // Calculate the change in x position
    const deltaX = futureMoon.x - currentMoon.x;

    let direction;

    // Decide the direction based on the change in x
    if (deltaX > epsilon) {
      direction = 1;          // moving to the right
    } else if (deltaX < -epsilon) {
      direction = -1;         // moving to the left
    } else {
      direction = 0;          // not moving (or too small to measure)
    }

    // Store the result for this moon
    results.push({
      moon: i + 1,
      deltaX: deltaX,
      direction: direction
    });
  }

  return results;
}


// ------- Zoom Buttons Code ----

function drawZoomButtons() {
  const w = g.getWidth();
  const h = g.getHeight();
  const btnSize = 34;
  const margin = 5;

  // Use a vector font so scaling works properly
  g.setFont("Vector", 28);
  g.setFontAlign(0, 0); // centre, centre
  g.setColor(0,0,0);

  // --- Zoom In (+) bottom-left ---
  const plusX1 = w - btnSize - margin;
  const plusY1 = h - btnSize - margin;
  const plusX2 = w - margin;
  const plusY2 = h - margin;
  
  // Button outline
  g.drawRect(plusX1, plusY1, plusX2, plusY2);

  // Center of button
  const plusCX = ((plusX1 + plusX2) / 2);
  const plusCY = ((plusY1 + plusY2) / 2)+2;

  // Draw + (draw twice for extra boldness)
  g.drawString("+", plusCX, plusCY);
  g.drawString("+", plusCX + 1, plusCY);

  // --- Zoom Out (-) bottom-right ---
  const minusX1 = margin;
  const minusY1 = h - btnSize - margin;
  const minusX2 = margin + btnSize;
  const minusY2 = h - margin;

  g.drawRect(minusX1, minusY1, minusX2, minusY2);

  const minusCX = ((minusX1 + minusX2) / 2)+2;
  const minusCY = ((minusY1 + minusY2) / 2)+2;

  // Draw − (draw twice for boldness)
  g.drawString("-", minusCX, minusCY);
  g.drawString("-", minusCX + 1, minusCY);
}


// ------- Touch Input code ------

Bangle.on('touch', function(_, e) {
  const x = e.x;
  const y = e.y;

  const w = g.getWidth();
  const h = g.getHeight();
  const margin = 5;

  // Zoom In (+) bottom-left
  if (
    x >= w - btnSize - margin &&
    x <= w - margin &&
    y >= h - btnSize - margin &&
    y <= h - margin
  ) {
    zoomFactor = Math.min(MAX_ZOOM, zoomFactor * ZOOM_STEP);
    redraw();
    console.log("Zoom in button clicked");
    console.log("Zoom factor =", zoomFactor);
    return;
  }

  // Zoom Out (-) bottom-right
  if (
    x >= margin &&
    x <= margin + btnSize &&
    y >= h - btnSize - margin &&
    y <= h - margin
  ) {
    zoomFactor = Math.max(MIN_ZOOM, zoomFactor / ZOOM_STEP);
    redraw();
    console.log("Zoom out button clicked");
    console.log("Zoom factor =", zoomFactor);
    return;
  }
});

// ------- Drawing Code ---------

function drawJupiterSystem(){

  // Draw Jupiter system (white fill, black outline)

  let myscale = scenescale * zoomFactor;

  jupiterRadiusInPixels = myscale * 1.5;

  g.setColor(1, 0.5, 0); //orange fill
  g.fillCircle(cx, cy, jupiterRadiusInPixels);
  g.setColor(0,0,0); // black outline
  g.drawCircle(cx, cy, jupiterRadiusInPixels);

  // Draw moons (black filled circles)
  g.setColor(0,0,0);
  moonsDataset01.moons.forEach(m => {
    const x = cx + m.x * myscale;
    const y = cy - m.y * myscale; // invert Y for Bangle screen
    g.fillCircle(x, y, 2);
  });

   // Draw labels for moons and Jupiter
  drawMoonLabelsWithLeaderLinesProperEdgeSafe(jupiterRadiusInPixels);
  drawJupiterLabelSafe(jupiterRadiusInPixels);
  drawFieldOfViewLabelLeftTwoLines(jupiterRadiusInPixels);
  drawJupiterMoonDirectionArrows();

}

// ------- Moon Labels Above Central Strip Evenly Spread Vertically Above Jupiterwith Bounding Boxes, Leader Lines,d Edge-Safe Clamping, Ofscreen Detection with Moon radius considered) -----

function drawMoonLabelsWithLeaderLinesProperEdgeSafe() {
  
  const labels = ["Io", "Europa", "Ganymede", "Callisto"];
  const myscale = scenescale * zoomFactor;

  g.setFont("Vector", 12);
  g.setFontAlign(0, 0); // center alignment

  const topMargin = 15; // distance from top of screen
  const bottomLabelY = cy - jupiterRadiusInPixels - 10; // bottom edge above Jupiter
  const step = (bottomLabelY - topMargin) / (labels.length - 1);

  // Precompute all positions and bounding boxes
  const moonData = moonsDataset01.moons.map((m, i) => {
    
    const moonX = cx + m.x * myscale;
    const moonY = cy - m.y * myscale;

    // If moon is offscreen (consider radius), mark it as invisible
    const isOffscreen = (moonX + moonRadiusInPixels < 0) || (moonX - moonRadiusInPixels > g.getWidth());

    // Compute label X and Y
    let labelX = moonX;
    const labelY = bottomLabelY - step * i;

    const textWidth = g.stringWidth(labels[i]);
    const textHeight = 12;
    const padding = 2;

    // Clamp label X to keep it fully visible on screen
    const minX = textWidth / 2 + padding;
    const maxX = g.getWidth() - textWidth / 2 - padding;
    if (labelX < minX) labelX = minX;
    if (labelX > maxX) labelX = maxX;

    // Compute bounding box
    const bbox = {
      x1: labelX - textWidth / 2 - padding,
      y1: labelY - textHeight / 2 - padding,
      x2: labelX + textWidth / 2 + padding,
      y2: labelY + textHeight / 2 + padding
    };

    return { 

      moonX, 
      moonY, 
      labelX, 
      labelY, 
      bbox, 
      label: labels[i], 
      isOffscreen 
      
    };
    
  });

  const gapBetweenMoonAndLeaderStart = 5;

  // --- First pass: draw all leader lines ---
  g.setColor(0,0,0);
  moonData.forEach(d => {
    if (d.isOffscreen) return; // skip offscreen moons
    g.drawLine(d.moonX, d.moonY - gapBetweenMoonAndLeaderStart, d.labelX, d.bbox.y1);
  });

  // --- Second pass: draw all rectangles behind labels ---
  g.setColor(1,1,1);
  moonData.forEach(d => {
    if (d.isOffscreen) return; // skip offscreen moons
    g.fillRect(d.bbox.x1, d.bbox.y1, d.bbox.x2, d.bbox.y2);
  });

  // --- Third pass: draw all label texts ---
  g.setColor(0,0,0);
  moonData.forEach(d => {
    if (d.isOffscreen) return; // skip offscreen moons
    g.drawString(d.label, d.labelX, d.labelY);
  });
}

// ------- Jupiter Label Below the Planet (Edge-Safe from Touch button Zones) -----

function drawJupiterLabelSafe() {
  const jupiterLabelText = "Jupiter";
  const padding = 2;

  // Determine top of touch zones (assuming bottom buttons height + margin)
  //const btnHeight = 34;      // height of your zoom buttons
  const margin = 5;          // margin from edge
  //const touchTopY = g.getHeight() - btnHeight - margin;

  // Compute Y position: halfway between bottom of Jupiter and top of touch zones
  //const lowerlabelsYposn = cy + jupiterRadiusInPixels + ((touchTopY - (cy + jupiterRadiusInPixels)) / 2);
  const lowerlabelsYposn = g.getHeight() - btnSize - margin - 25 + textHeight;

  let jupiterLabelX = cx; // center horizontally

  // Clamp horizontally if needed (just in case)
  const textWidth = g.stringWidth(jupiterLabelText);
  const minX = (textWidth / 2) + padding;
  const maxX = g.getWidth() - (textWidth / 2) - padding;
  if (jupiterLabelX < minX) jupiterLabelX = minX;
  if (jupiterLabelX > maxX) jupiterLabelX = maxX;

  // Bounding box for the label
  const bbox = {
    x1: jupiterLabelX - (textWidth / 2) - padding,
    y1: lowerlabelsYposn - (textHeight / 2) - padding,
    x2: jupiterLabelX + (textWidth / 2) + padding,
    y2: lowerlabelsYposn + (textHeight / 2) + padding
  };

  // --- Draw leader line from bottom center of Jupiter to top of label rectangle ---
  //g.setColor(textColour);
  //g.drawLine(cx, cy + jupiterRadiusInPixels, jupiterLabelX, bbox.y1);

  // --- Draw white rectangle behind label ---
  g.setColor(1,1,1);
  g.fillRect(bbox.x1, bbox.y1, bbox.x2, bbox.y2);

  // --- Draw label text ---
  g.setColor(0,0,0);
  g.setFont("Vector", textHeight);
  g.setFontAlign(0,0); // center alignment
  g.drawString(jupiterLabelText, jupiterLabelX, lowerlabelsYposn);
}

// ------- Draw Field of View Label Below Jupiter (Left-Aligned) -----
// ------- Draw Field of View Label Below Jupiter (Two-Line, Left-Aligned) -----

function drawFieldOfViewLabelLeftTwoLines() {
  // Calculate FOV in "Jupiter radii"
  const FOV = 2 * MAX_ORBIT_RJ / zoomFactor; // approximate diameter in RJ
  const RJinDeg = (FOV * (40/3600)).toFixed(2);

  const textLine = `${RJinDeg} °`;

  //const padding = 12;
  //const lineSpacing = 2; // pixels between lines

  // Determine top of touch zones (assuming bottom buttons height + margin)
  // using btnSize assumes square buttons
  const touchTopY = g.getHeight() - btnSize - margin;

  // Compute Y position for text
  const labelYTop = touchTopY - 25 + textHeight;

  // Align to left margin
  const labelX = 28;

  // --- Draw white rectangle behind label ---
  g.setColor(1,1,1);
  //g.fillRect(bbox.x1, bbox.y1, bbox.x2, bbox.y2);

  // --- Draw the text ---
  g.setColor(textColour);
  g.setFont("Vector", textHeight);
  g.setFontAlign(0,0); // centre alignment within bounding box
  g.drawString(textLine, labelX, labelYTop);

}

// draw travel direction arrow for each moon
function drawJupiterMoonDirectionArrows() {

  // to scale moons position coordinates to display
  const myscale = scenescale * zoomFactor;
  
  // Get the direction data for each moon
  const moonDirections = getJupiterMoonDirections();
  // Get the position data for the current date and time
  const currentPositions = moonsDataset01;
  

  // Loop through each moon result
  for (let i = 0; i < moonDirections.length; i++) {

    const moonData = moonDirections[i];
  
    const currentMoon = currentPositions.moons[i];
    
    const moonArrowsYposn = cy + jupiterRadiusInPixels + 7;
    //const moonArrowsYposn = cy - (currentMoon.y * myscale)+15
    
    // If the moon is moving to the right, draw a right arrow
    if (moonData.direction === 1) {
      drawArrowRightAt(cx + (currentMoon.x * myscale), moonArrowsYposn);
    }

    // If the moon is moving to the left, draw a left arrow
    if (moonData.direction === -1) {
      drawArrowLeftAt(cx + (currentMoon.x * myscale), moonArrowsYposn);
    }

    // If direction is 0, do not draw any arrow
  }
  
  //console.log(moonDirections);
  
}

// arrow drawing functions
function drawArrowRightAt(x, y) {

  // Arrow shaft
  g.drawLine(x - 4, y, x + 4, y);

  // Arrow head
  g.drawLine(x + 4, y, x, y - 4);
  g.drawLine(x + 4, y, x, y + 4);
}

function drawArrowLeftAt(x, y) {

  // Arrow shaft
  g.drawLine(x + 4, y, x - 4, y);

  // Arrow head
  g.drawLine(x - 4, y, x, y - 4);
  g.drawLine(x - 4, y, x, y + 4);
}


function redraw() {
  g.clear();
  g.setBgColor(1,1,1);
  drawJupiterSystem();   // your existing drawing function
  drawZoomButtons();
}

//---------- Main Sequence ----------

g.clear();
g.setBgColor(1,1,1);

//Set up the the touch screen buttons and zoom function
let zoomFactor = 1.0; //default
const ZOOM_STEP = 1.5;
const MIN_ZOOM = 0.75;
const MAX_ZOOM = 4;
const textColour = [0,0,0];
const textHeight = 12;
const btnSize = 30; // zoom button size, assumes square button
const moonRadiusInPixels = 2; // pixel radius of moons
var jupiterRadiusInPixels = 0; //s tarting radius before functions run, used by multiple functions

// Screen centre
const cx = g.getWidth() / 2;
const cy = g.getHeight() / 2;

// Get moon positions
const moonsDataset01 = calculateJupiterMoonPositions();
const moonsDataset02 = calculateJupiterMoonPositions(5); //x mins offset to determine each moon's direction of motion

// --------

// scene scale based on theoretical max orbits of the moons
// Fixed maximum field of view (Callisto)
const MAX_ORBIT_RJ = 27;

// Leave margin so nothing touches the edge
const margin = 5;

// Fixed scale based on theoretical maximum orbit
var scenescale =
  (Math.min(g.getWidth(), g.getHeight()) / 2 - margin) /
  MAX_ORBIT_RJ;
console.log("Current scale =", scenescale);

// ---------

//drawJupiterSystem();
redraw();

