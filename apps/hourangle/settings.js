(function(back) {
var SETTINGS_FILE = "hourangle.settings.json";
  
// Load existing settings
var settings = Object.assign({
  //set the default values if empty
  longitudeDegrees: 3,  // Default longitude angle
  longitudeDirection: 1,  // Default longitude direction (East=0, West=1)
  reticuleValidityYearStart: 2000,  // Default start year
  reticuleValidityYearEnd: 2030,  // Default end year
  reticuleDisplayStyle: 1  // Default reticule style
}, require('Storage').readJSON(SETTINGS_FILE, true) || {});

// Write new settings function
function writeSettings() {require('Storage').writeJSON(SETTINGS_FILE, settings);}


// Create and show the settings menu
E.showMenu({
  "" : { "title" : "App Name" },
  "< Back" : () => back(),
  'On or off?': {value: !!settings.onoroff, // !! converts undefined to false
  onchange: v => {settings.onoroff = v;writeSettings();}},
  
  'How Many?': {value: 0|settings.howmany, // 0| converts undefined to 0
  min: 0,
  max: 10,
  onchange: v => {settings.howmany = v; writeSettings(); }},
});

// end brackets
})
