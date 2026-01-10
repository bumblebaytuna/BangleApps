(function(back) {
  var settings = require("Storage").readJSON("hourangle.settings.json",1) || {};

  if (settings.longitude === undefined) settings.longitude = 0;
  if (settings.lonDir === undefined) settings.lonDir = (settings.longitude < 0) ? 1 : 0;
  if (settings.useGPS === undefined) settings.useGPS = false;
  if (!settings.displayStyle) settings.displayStyle = 1;
  if (settings.validityYearFrom === undefined) settings.validityYearFrom = 2000;
  if (settings.validityYearTo === undefined) settings.validityYearTo = 2030;
  if (settings.myYear === undefined) settings.myYear = 2000;

  function updateSettings() {
    require("Storage").writeJSON("hourangle.settings.json", settings);
  }

  function getLonDegrees() {
    return Math.abs(settings.longitude);
  }

  function getLonDir() {
    return (settings.longitude < 0) ? "W" : "E";
  }

  function updateLonFromUI(deg, dir) {
    settings.lonDir = (dir === "W") ? 1 : 0;
    settings.longitude = (dir === "W") ? -deg : deg;
    updateSettings();
  }

  function getDigits() {
    return settings.myYear.toString().padStart(4,"0").split("").map(Number);
  }
  
  const displayStyleOptions = [
    { text:"Style 1", value:1 },
    { text:"Style 2", value:2 },
    { text:"Style 3", value:3 }
  ];

  const directionOptions = [
    { text:"E", value:0 },
    { text:"W", value:1 }
  ];

  function showYearDigitsMenu() {
    var digits = getDigits();
    var menu = {
      "" : { "title" : "Edit Year" },
      "< Back" : function() {
        settings.myYear = Number(digits.join(""));
        updateSettings();
        showMainMenu();
      }
    };

    ["Thousands", "Hundreds", "Tens", "Ones"].forEach(function(label, i) {
      menu[label] = {
        value: digits[i],
        min: 0,
        max: 9,
        step: 1,
        format: v => v.toString(),
        onchange: v => { digits[i] = v; }
      };
    });

    E.showMenu(menu);
  }

  var mainmenu = {
    "" : { "title" : "Hour Angle" },
    "< Back" : back,
    "Year" : showYearDigitsMenu,  // ✅ added comma

    /*LANG*/"Longitude °" : {
      value: getLonDegrees(),
      min: 0,
      max: 180,
      step: 1,
      format: v => v + "°",
      onchange: v => {
        updateLonFromUI(v, getLonDir());
      }
    },

    /*LANG*/"Longitude Dir" : {
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
            settings.longitude = opt.value ? -Math.abs(settings.longitude)
                                            : Math.abs(settings.longitude);
            updateSettings();
            E.showMenu(mainmenu);
          }
        };
        return m;
      }, {})
    },

    /*LANG*/"Display Style" : {
      value: settings.displayStyle,
      min: 1,
      max: 3, // ✅ corrected
      step: 1,
      format: v => "Style " + v,
      onchange: v => {
        settings.displayStyle = v;
        updateSettings();
      },
      submenu: displayStyleOptions.reduce((m,opt)=>{
        m[opt.text] = {
          checked: settings.displayStyle === opt.value,
          onchange: () => {
            settings.displayStyle = opt.value;
            updateSettings();
            E.showMenu(mainmenu);
          }
        };
        return m;
      }, {})
    },
  };
  
  function showMainMenu() { E.showMenu(mainmenu); }

  showMainMenu();
})();
