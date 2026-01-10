(function(back) {
var SETTINGS_FILE = "hourangle.settings.json";
  
// Load existing settings
var mysettings = Object.assign({
  //set the default values if empty
  useGPS: false,  // Default GPS setting
  longitudeDegrees: 3,  // Default longitude angle
  longitudeDirection: 1,  // Default longitude direction (East=0, West=1)
  reticuleValidityYearStart: 2000,  // Default start year
  reticuleValidityYearEnd: 2030,  // Default end year
  reticuleDisplayStyle: 1  // Default reticule style
}, require('Storage').readJSON(SETTINGS_FILE, true) || {});

// Write new settings function
function writeSettings() {require('Storage').writeJSON(SETTINGS_FILE, mysettings);}


// Create and show the top-level settings menu
E.showMenu({
  //generic title and back button
  "" : { "title" : "App Name" },
  "< Back" : () => back(),
  // custom rows
  'Use GPS': {value: !!mysettings.useGPS, // The !! converts the empty value to the default GPS setting
  onchange: v => {mysettings.useGPS = v;writeSettings();}},
  
  'Display Style': {value: 1|mysettings.reticuleDisplayStyle, // The 1| converts the empty value to the default Display Style setting
  min: 1,
  step: 1,
  max: 2,
  onchange: v => {mysettings.reticuleDisplayStyle = v; writeSettings(); }},
});

// end brackets
})
