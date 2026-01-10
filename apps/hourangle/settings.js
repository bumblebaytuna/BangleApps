(function() {
  // Settings file
  var SETTINGS_FILE = "hourangle.settings.json";

  // Load existing settings or use defaults
  var mysettings = Object.assign({
    useGPS: false,
    longitudeDegrees: 3,
    longitudeDirection: 1,
    reticuleValidityYearStart: 2000,
    reticuleValidityYearEnd: 2030,
    reticuleDisplayStyle: 1
  }, require('Storage').readJSON(SETTINGS_FILE, true) || {});

  // Write settings to file
  function writeSettings() {
    require('Storage').writeJSON(SETTINGS_FILE, mysettings);
  }

  // -----------------------------
  // Main Top-Level Menu
  // -----------------------------
  function showMainMenu() {
    E.showMenu({
      "": { "title": "Hour Angle" },
      "< Back": () => E.showMenu(null),  // Exit app / go to default menu

      // GPS Setting
      "Use GPS": {
        value: !!mysettings.useGPS,
        onchange: v => { mysettings.useGPS = v; writeSettings(); }
      },

      // Reticule Display Style
      "Display Style": {
        value: 1 | mysettings.reticuleDisplayStyle,
        min: 1,
        max: 2,
        step: 1,
        onchange: v => { mysettings.reticuleDisplayStyle = v; writeSettings(); }
      },

      // Submenu for Longitude Angle
      "Longitude Angle": () => showSubMenuLongitudeAngle(),

      // Submenu for Longitude Direction
      "Longitude Direction": () => showSubMenuLongitudeDirection(),

      // Submenu for Reticule Validity Years
      "Validity Years": () => showSubMenuValidityYears()
    });
  }

  // -----------------------------
  // Submenu: Longitude Angle
  // -----------------------------
  function showSubMenuLongitudeAngle() {
    E.showMenu({
      "": { "title": "Longitude Angle" },
      "< Back": showMainMenu,

      "Degrees": {
        value: mysettings.longitudeDegrees,
        min: 0,
        max: 180,
        step: 1,
        onchange: v => { mysettings.longitudeDegrees = v; writeSettings(); }
      }
    });
  }

  // -----------------------------
  // Submenu: Longitude Direction
  // -----------------------------
  function showSubMenuLongitudeDirection() {
    E.showMenu({
      "": { "title": "Longitude Direction" },
      "< Back": showMainMenu,

      "Direction": {
        value: mysettings.longitudeDirection,
        min: 0,  // 0 = East, 1 = West
        max: 1,
        step: 1,
        format: v => v === 0 ? "East" : "West",
        onchange: v => { mysettings.longitudeDirection = v; writeSettings(); }
      }
    });
  }

  // -----------------------------
  // Submenu: Reticule Validity Years
  // -----------------------------
  function showSubMenuValidityYears() {
    E.showMenu({
      "": { "title": "Validity Years" },
      "< Back": showMainMenu,

      "Start Year": {
        value: mysettings.reticuleValidityYearStart,
        min: 1900,
        max: 2100,
        step: 1,
        onchange: v => { mysettings.reticuleValidityYearStart = v; writeSettings(); }
      },

      "End Year": {
        value: mysettings.reticuleValidityYearEnd,
        min: 1900,
        max: 2100,
        step: 1,
        onchange: v => { mysettings.reticuleValidityYearEnd = v; writeSettings(); }
      }
    });
  }

  // -----------------------------
  // Start the app
  // -----------------------------
  E.showMenu(null);  // Clear any default menu
  showMainMenu();    // Show our custom menu
})();
