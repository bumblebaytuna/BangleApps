(function(back) {

  var SETTINGS_FILE = "hourangle.settings.json";
    
  var mysettings = Object.assign({
    useGPS: false,
    longitudeDegrees: 3,
    longitudeDirection: 1,
    reticuleValidityYearStart: 2000,
    reticuleValidityYearEnd: 2030,
    reticuleDisplayStyle: 1
  }, require('Storage').readJSON(SETTINGS_FILE, true) || {});
  
  function writeSettings() {
    require('Storage').writeJSON(SETTINGS_FILE, mysettings);
  }

  function showMainMenu() {
    E.showMenu({
      "" : { "title" : "Hour Angle" },
      "< Back" : () => back(),
      'Use GPS': {
        value: !!mysettings.useGPS,
        onchange: v => { mysettings.useGPS = v; writeSettings(); }
      },
      'Display Style': {
        value: 1|mysettings.reticuleDisplayStyle,
        min: 1, step: 1, max: 2,
        onchange: v => { mysettings.reticuleDisplayStyle = v; writeSettings(); }
      },
      'Longitude Angle': () => showSubMenuLongitudeAngle()
    });
  }

  function showSubMenuLongitudeAngle() {
    E.showMenu({
      "" : { "title" : "Longitude" },
      "< Back" : () => showMainMenu()
    });
  }

  // Start menu
  E.showMenu(null);
  showMainMenu();

})(function() { E.showMenu(null); });  // <-- IIFE is now invoked
