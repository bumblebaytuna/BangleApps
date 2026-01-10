(function(back) {
  // Load settings, or default to empty object
  var settings = require("Storage").readJSON("hourangle.settings.json",1) || {};

  // Ensure defaults exist
  if (settings.longitude === undefined) settings.longitude = 0;
  if (settings.lonDir === undefined) settings.lonDir = (settings.longitude < 0) ? 1 : 0;
  if (settings.useGPS === undefined) settings.useGPS = false;
  if (!settings.displayStyle) settings.displayStyle = 1;
  if (settings.validityYearFrom === undefined) settings.validityYearFrom = 2000;
  if (settings.validityYearTo === undefined) settings.validityYearTo = 2030;
  if (settings.myYear === undefined) settings.myYear = 2000;

  // Function to save settings
  function updateSettings() {
    require("Storage").writeJSON("hourangle.settings.json", settings);
  }

  // Longitude helpers
  function getLonDegrees() { return Math.abs(settings.longitude); }
  function getLonDir() { return (settings.longitude < 0) ? "W" : "E"; }
  function updateLonFromUI(deg, dir) {
    settings.lonDir = (dir === "W") ? 1 : 0;
    settings.longitude = (dir === "W") ? -deg : deg;
    updateSettings();
  }

  // Convert year to 4-digit array
  function getDigits() {
    return settings.myYear.toString().padStart(4,"0").split("").map(Number);
  }

  // Define display style options
  const displayStyleOptions = [
    { text:"Style 1", value:1 },
    { text:"Style 2", value:2 }
  ];

  const directionOptions = [
    { text:"E", value:0 },
    { text:"W", value:1 }
  ];

  // Nested submenu for editing each digit
  function showYearDigitsMenu() {
    var digits = getDigits();

    function makeMenu() {
      var menu = {
        "" : { "title" : digits.join("") },
        "< Back" : function() {
          settings.myYear = Number(digits.join(""));
          updateSettings();
          showMainMenu();
        }
      };

      ["Thousands","Hundreds","Tens","Ones"].forEach(function(label,i){
        menu[label] = {
          value: digits[i],
          min: 0,
          max: 9,
          step: 1,
          format: v => v.toString(),
          onchange: v => {
            digits[i] = v;
            E.showMenu(makeMenu());
          }
        };
      });

      return menu;
    }

    E.showMenu(makeMenu());
  }

  // Main menu
  var mainmenu = {
    "" : { "title" : "Hour Angle" },
    "< Back" : back,
    "Year" : showYearDigitsMenu,

    "Longitude °" : {
      value: getLonDegrees(),
      min: 0,
      max: 180,
      step: 1,
      format: v => v + "°",
      onchange: v => updateLonFromUI(v,getLonDir())
    },

    "Longitude Dir" : {
      value: settings.lonDir,
      min: 0,
      max: 1,
      step: 1,
      format: v => v === 0 ? "E" : "W",
      onchange: v => {
        settings.lonDir = v;
        settings.longitude = v ? -Math.abs(settings.longitude) : Math.abs(settings.longitude);
        updateSettings();
      },
      submenu: directionOptions.reduce((m,opt)=>{
        m[opt.text] = {
          checked: settings.lonDir === opt.value,
          onchange: () => {
            settings.lonDir = opt.value;
            settings.longitude = opt.value ? -Math.abs(settings.longitude) : Math.abs(settings.longitude);
            updateSettings();
            E.showMenu(mainmenu);
          }
        };
        return m;
      }, {})
    },

    "Display Style" : {
      value: settings.displayStyle,
      min: 1,
      max: 2,
      step: 1,
      format: v => "Style " + v,
      onchange: v => { settings.displayStyle = v; updateSettings(); },
      submenu: displayStyleOptions.reduce((m,opt)=>{
        m[opt.text] = {
          checked: settings.displayStyle === opt.value,
          onchange: () => { settings.displayStyle = opt.value; updateSettings(); E.showMenu(mainmenu); }
        };
        return m;
      }, {})
    }
  };

  function showMainMenu() { E.showMenu(mainmenu); }

  showMainMenu();

})();
