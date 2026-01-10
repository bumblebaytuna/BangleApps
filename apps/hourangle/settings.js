(function(back) {
  // Load settings, or default to empty object
  var settings = require("Storage").readJSON("hourangle.settings.json",1) || {};

  // Ensure defaults exist
  if (settings.longitude === undefined) settings.longitude = 0;
  if (settings.lonDir === undefined) settings.lonDir = (settings.longitude < 0) ? 1 : 0;
  if (settings.useGPS === undefined) settings.useGPS = false;
  if (!settings.displayStyle) settings.displayStyle = 1; // default style = 1
  if (settings.validityYearFrom === undefined) settings.validityYearFrom = 2000;
  if (settings.validityYearTo === undefined)   settings.validityYearTo   = 2030;
  if (settings.myYear === undefined) settings.myYear = 2000;

  // Function to save settings
  function updateSettings() {
    require("Storage").writeJSON("hourangle.settings.json", settings);
  }

  // Longitude helpers
  function getLonDegrees() { return Math.abs(settings.longitude); }
  function getLonDir() { return (settings.longitude < 0) ? "W" : "E"; }
  function updateLonFromUI(deg, dir) {
    settings.lonDir = dir;
    settings.longitude = (dir === "W") ? -deg : deg;
    updateSettings();
  }

  // Year helpers
  function splitDigits(year) {
    return [
      Math.floor(year / 1000),          // thousands
      Math.floor((year % 1000) / 100),  // hundreds
      Math.floor((year % 100) / 10),    // tens
      year % 10                          // ones
    ];
  }

  function combineDigits(d) { return d[0]*1000 + d[1]*100 + d[2]*10 + d[3]; }

  // Display style options
  const displayStyleOptions = [
    { text:"Style 1", value:1 },
    { text:"Style 2", value:2 }
  ];

  const directionOptions = [
    { text:"E", value:0 },
    { text:"W", value:1 }
  ];

  // Nested submenu for editing Year
  function makeYearMenu() {
    var digits = splitDigits(settings.myYear);
    return {
      "" : { "title": digits.join("") },
      "< Back": function() { E.showMenu(mainmenu); },
      "Thousands": { value: digits[0], min:1, max:2, step:1, onchange:v=>{ digits[0]=v; settings.myYear=combineDigits(digits); updateSettings(); E.showMenu(makeYearMenu()); } },
      "Hundreds":  { value: digits[1], min:0, max:9, step:1, onchange:v=>{ digits[1]=v; settings.myYear=combineDigits(digits); updateSettings(); E.showMenu(makeYearMenu()); } },
      "Tens":      { value: digits[2], min:0, max:9, step:1, onchange:v=>{ digits[2]=v; settings.myYear=combineDigits(digits); updateSettings(); E.showMenu(makeYearMenu()); } },
      "Ones":      { value: digits[3], min:0, max:9, step:1, onchange:v=>{ digits[3]=v; settings.myYear=combineDigits(digits); updateSettings(); E.showMenu(makeYearMenu()); } }
    };
  }

  // Main menu
  var mainmenu = {
    "" : { "title" : "Hour Angle" },
    "< Back" : back,

    "Year": (() => {
      // return a function to show the year submenu
      return () => { E.showMenu(makeYearMenu()); };
    })(),

    "Longitude °": {
      value: getLonDegrees(),
      min: 0,
      max: 180,
      step: 1,
      format: v => v + "°",
      onchange: v => updateLonFromUI(v,getLonDir())
    },

    "Longitude Dir": {
      value: settings.lonDir,
      min:0,
      max:1,
      step:1,
      format: v => v===0?"E":"W",
      onchange: v => {
        settings.lonDir=v;
        settings.longitude = v?-Math.abs(settings.longitude):Math.abs(settings.longitude);
        updateSettings();
      },
      submenu: directionOptions.reduce((m,opt)=>{
        m[opt.text] = {
          checked: settings.lonDir===opt.value,
          onchange: () => {
            settings.lonDir = opt.value;
            settings.longitude = opt.value?-Math.abs(settings.longitude):Math.abs(settings.longitude);
            updateSettings();
            E.showMenu(mainmenu);
          }
        };
        return m;
      }, {})
    },

    "Display Style": {
      value: settings.displayStyle,
      min:1,
      max:2,
      step:1,
      format:v=>"Style "+v,
      onchange:v=>{ settings.displayStyle=v; updateSettings(); },
      submenu: displayStyleOptions.reduce((m,opt)=>{
        m[opt.text]={ checked: settings.displayStyle===opt.value, onchange: ()=>{ settings.displayStyle=opt.value; updateSettings(); E.showMenu(mainmenu); } };
        return m;
      }, {})
    },

    "Valid From (YYYY)": (() => {
      let digits = splitDigits(settings.validityYearFrom);
      return {
        value: digits[0],
        min: 1, max: 2, step:1,
        format:v=>combineDigits([v,digits[1],digits[2],digits[3]]),
        onchange:v=>{ digits[0]=v; settings.validityYearFrom=combineDigits(digits); updateSettings(); },
        submenu: {
          "Thousands": { value: digits[0], min:1, max:2, step:1, onchange:v=>{ digits[0]=v; settings.validityYearFrom=combineDigits(digits); updateSettings(); } },
          "Hundreds":  { value: digits[1], min:0, max:9, step:1, onchange:v=>{ digits[1]=v; settings.validityYearFrom=combineDigits(digits); updateSettings(); } },
          "Tens":      { value: digits[2], min:0, max:9, step:1, onchange:v=>{ digits[2]=v; settings.validityYearFrom=combineDigits(digits); updateSettings(); } },
          "Ones":      { value: digits[3], min:0, max:9, step:1, onchange:v=>{ digits[3]=v; settings.validityYearFrom=combineDigits(digits); updateSettings(); } }
        }
      };
    })(),

    "Valid To (YYYY)": (() => {
      let digits = splitDigits(settings.validityYearTo);
      return {
        value: digits[0],
        min: 1, max: 2, step:1,
        format:v=>combineDigits([v,digits[1],digits[2],digits[3]]),
        onchange:v=>{ digits[0]=v; settings.validityYearTo=combineDigits(digits); updateSettings(); },
        submenu: {
          "Thousands": { value: digits[0], min:1, max:2, step:1, onchange:v=>{ digits[0]=v; settings.validityYearTo=combineDigits(digits); updateSettings(); } },
          "Hundreds":  { value: digits[1], min:0, max:9, step:1, onchange:v=>{ digits[1]=v; settings.validityYearTo=combineDigits(digits); updateSettings(); } },
          "Tens":      { value: digits[2], min:0, max:9, step:1, onchange:v=>{ digits[2]=v; settings.validityYearTo=combineDigits(digits); updateSettings(); } },
          "Ones":      { value: digits[3], min:0, max:9, step:1, onchange:v=>{ digits[3]=v; settings.validityYearTo=combineDigits(digits); updateSettings(); } }
        }
      };
    })()
  };

  // Show the main menu immediately
  E.showMenu(mainmenu);

})();
