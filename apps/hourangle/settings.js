(function(back) {
  var settings = require("Storage").readJSON("hourangle.settings.json",1)||{};
  function updateSettings() {
    require("Storage").writeJSON("hourangle.settings.json", settings);
  }
  var mainmenu = {
    "" : { "title" : "Hour Angle" },
    "< Back" : back,
    /*LANG*/"Connected" : { value : NRF.getSecurityStatus().connected?/*LANG*/"Yes":/*LANG*/"No" },
    /*LANG*/"Use 'Today',..." : {
      value : !!settings.useToday,
      onchange: v => {
        settings.useToday = v;
        updateSettings();
      }
    },
    /*LANG*/"Full Brightness" : {
      value : !!settings.fullBrightness,
      onchange: v => {
        settings.fullBrightness = v;
        updateSettings();
      }
    }
  };
  E.showMenu(mainmenu);
})
