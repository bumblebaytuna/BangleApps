(function(back) {
  // Load settings, or default to empty object
  var settings = require("Storage").readJSON("hourangle.settings.json",1)||{};

  // Ensure defaults exist
  if (settings.longitude===undefined) settings.longitude = 0;
  if (settings.useGPS===undefined) settings.useGPS = false;
  if (!settings.displayStyle) settings.displayStyle = 1; // default style = 1

  // Function to save settings
  function updateSettings() {
    require("Storage").writeJSON("hourangle.settings.json", settings);
  }

  // Define display style options (display text and corresponding stored value)
  const displayOptions = [
    {text:"Style 1", value:1},
    {text:"Style 2", value:2},
    {text:"Style 3", value:3}
  ];

  // Main menu
  var mainmenu = {
    "" : { "title" : "Hour Angle" },
    "< Back" : back,

    /*LANG*/"Longitude" : {
      value: settings.longitude,
      min: -180,
      max: 180,
      step: 1,
      onchange: v => {
        settings.longitude = v;
        updateSettings();
      }
    },

    /*LANG*/"Use GPS" : {
      value: !!settings.useGPS,
      onchange: v => {
        settings.useGPS = v;
        updateSettings();
      }
    },

    /*LANG*/"Display Style" : {
      value: settings.displayStyle,
      min: 1,
      max: 2,
      step: 1,
      format: v => "Style " + v, // shows user-friendly text
      onchange: v => {
        settings.displayStyle = v;
        updateSettings();
      },
      submenu: displayOptions.reduce((m,opt)=>{
        m[opt.text] = {
          checked: settings.displayStyle===opt.value,
          onchange: () => {
            settings.displayStyle = opt.value; // store numeric value
            updateSettings();
            E.showMenu(mainmenu); // go back to main menu
          }
        };
        return m;
      }, {})
    }
  };

  E.showMenu(mainmenu);
})
