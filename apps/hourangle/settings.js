(function(back) {
  const Storage = require("Storage");
  const FILE = "myapp.settings.json";

  // Load settings with defaults
  let settings = Object.assign({
    enabled: true,
    mode: 1
  }, Storage.readJSON(FILE, true) || {});

  function writeSettings() {
    Storage.writeJSON(FILE, settings);
  }

  function showSubMenu2() {
    E.showMenu({
      "" : { title : "Sub Menu 2" },
      "< Back" : () => showMainMenu()
    });
  }

  function showSubMenu4() {
    E.showMenu({
      "" : { title : "Sub Menu 4" },
      "< Back" : () => showMainMenu()
    });
  }

  function showSubMenu5() {
    E.showMenu({
      "" : { title : "Sub Menu 5" },
      "< Back" : () => showMainMenu()
    });
  }

  function showMainMenu() {
    E.showMenu({
      "" : { title : "My App" },

      "Enabled" : {
        value : !!settings.enabled,
        onchange : v => {
          settings.enabled = v;
          writeSettings();
        }
      },

      "Sub Menu 2" : () => showSubMenu2(),

      "Mode" : {
        value : 0 | settings.mode,
        min : 1,
        max : 2,
        step : 1,
        format : v => v === 1 ? "Option 1" : "Option 2",
        onchange : v => {
          settings.mode = v;
          writeSettings();
        }
      },

      "Sub Menu 4" : () => showSubMenu4(),
      "Sub Menu 5" : () => showSubMenu5(),

      "< Back" : () => back()
    });
  }

  showMainMenu();
})(load);
