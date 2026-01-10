(function(back) {
  var settings = require("Storage").readJSON("hourangle.settings.json",1) || {};

  // Defaults
  if (settings.validityYearFrom === undefined) settings.validityYearFrom = 2000;
  if (settings.validityYearTo   === undefined) settings.validityYearTo   = 2030;

  if (settings.longitude === undefined) settings.longitude = 0;
  if (settings.lonDir === undefined) settings.lonDir = (settings.longitude < 0) ? 1 : 0;
  if (settings.useGPS === undefined) settings.useGPS = false;
  if (!settings.displayStyle) settings.displayStyle = 1;

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

  // Split/Combine digits
  function splitDigits(year) {
    return [
      Math.floor(year / 1000),
      Math.floor((year % 1000) / 100),
      Math.floor((year % 100) / 10),
      year % 10
    ];
  }
  function combineDigits(d) { return d[0]*1000 + d[1]*100 + d[2]*10 + d[3]; }

  // Display style options
  const displayStyleOptions = [
    { text:"Style 1", value:1 },
    { text:"Style 2", value:2 },
    { text:"Style 3", value:3 }
  ];

  const directionOptions = [
    { text:"E", value:0 },
    { text:"W", value:1 }
  ];

  // === VALIDITY YEAR SUBMENU GENERATOR ===
  function createYearMenu(label, settingName) {
    let digits = splitDigits(settings[settingName]);
    return {
      value: combineDigits(digits),
      format: v => v,
      submenu: {
        "Thousands": { value: digits[0], min:1, max:2, step:1,
          onchange: v => { digits[0]=v; settings[settingName]=combineDigits(digits); updateSettings(); } },
        "Hundreds":  { value: digits[1], min:0, max:9, step:1,
          onchange: v => { digits[1]=v; settings[settingName]=combineDigits(digits); updateSettings(); } },
        "Tens":      { value: digits[2], min:0, max:9, step:1,
          onchange: v => { digits[2]=v; settings[settingName]=combineDigits(digits); updateSettings(); } },
        "Ones":      { value: digits[3], min:0, max:9, step:1,
          onchange: v => { digits[3]=v; settings[settingName]=combineDigits(digits); updateSettings(); } }
      }
    };
  }

  // Main menu
  var mainmenu = {
    "" : { "title" : "Hour Angle" },
    "< Back" : back,

    "Longitude °" : {
      value: getLonDegrees(),
      min:0, max:180, step:1,
      format: v=>v+"°",
      onchange: v => updateLonFromUI(v, getLonDir())
    },
    "Longitude Dir" : {
      value: settings.lonDir, min:0, max:1, step:1,
      format: v => v===0?"E":"W",
      submenu: directionOptions.reduce((m,opt)=>{
        m[opt.text] = { checked: settings.lonDir===opt.value,
          onchange: ()=>{
            settings.lonDir = opt.value;
            settings.longitude = opt.value ? -Math.abs(settings.longitude)
                                           : Math.abs(settings.longitude);
            updateSettings();
            E.showMenu(mainmenu);
          }};
        return m;
      },{})
    },

    "Display Style" : {
      value: settings.displayStyle, min:1, max:2, step:1,
      format: v=>"Style "+v,
      submenu: displayStyleOptions.reduce((m,opt)=>{
        m[opt.text] = { checked: settings.displayStyle===opt.value,
          onchange: ()=>{
            settings.displayStyle = opt.value;
            updateSettings();
            E.showMenu(mainmenu);
          }};
        return m;
      },{})
    },

    // ===== Add Validity Years =====
    "Valid From" : createYearMenu("Valid From", "validityYearFrom"),
    "Valid To"   : createYearMenu("Valid To",   "validityYearTo")
  };

  E.showMenu(mainmenu);
})();
