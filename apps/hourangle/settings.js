//main function
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
  
  // write settings  to file function
  function writeSettings() {require('Storage').writeJSON(SETTINGS_FILE, mysettings);}

  //wrap the main top level menu in a function
  function showMainMenu() {
    // Create and show the top-level settings menu
    E.showMenu({
      
      //Menu Title and Back button
      "" : { "title" : "Hour Angle" },
      "< Back" : () => back(),
      
      // Add Custom Rows

      // Add the GPS row
      'Use GPS': {
        value: !!mysettings.useGPS, // The !! converts the empty value to the default GPS setting
        onchange: v => {mysettings.useGPS = v;writeSettings();}
      },

      // Add the Display Style row
      'Display Style': {
        value: 1|mysettings.reticuleDisplayStyle, // The 1| converts the empty value to the default Display Style setting
        min: 1,
        step: 1,
        max: 2,
        onchange: v => {mysettings.reticuleDisplayStyle = v; writeSettings();}
      },
      
     // Add the Longitude row to access the sub menu function
      'Longitude Angle':  () => showSubMenuLongitudeAngle()
      //"Longitude Direction >": () => showLongitudeDirectionMenu(),
      //"Validity Year Start >": () => showValidityYearsMenu()
        
    // showMenu function closing brackets
    });
    
  // showMainMenu function wrapper brackets
  }

  //wrap the nested sub menu in a function
  function showSubMenuLongitudeAngle() {
    // Create and show the first nested sub menu. Nested sub-menus are just functions that call E.showMenu() again. There’s no special syntax, just create another menu and switch to it.
     E.showMenu({
       
      //Menu Title and Back button
      "" : { "title" : "Longitude" },
      "< Back" : () => back(),
       
    // showMenu function closing brackets
    });
    
  // showSubMenuLongitude function wrapper brackets
  }

  // main control code - Start the main top level menu
  E.showMenu(null); // clear any previous default menu
  showSettingsMenu(); // start our custom top level menu
  
// main function end brackets
})

// add this if testing using the Espruino WEB IDE. comment it out if using it for the actual app
//(load);
