// app.js - MyAppName with nested settings menu

let settings = require("Storage").readJSON("myapp.json", 1) || {
  theme: "light",
  vibration: true,
  brightness: 7,
  advancedOption: false
};

function saveSettings() {
  require("Storage").writeJSON("myapp.json", settings);
}

// Nested submenu example
function showAdvancedMenu() {
  E.showMenu({
    "": { "title": "Advanced Settings" },
    "< Back": showSettingsMenu,
    "Advanced Option": {
      value: settings.advancedOption,
      format: v => v ? "On" : "Off",
      onchange: v => {
        settings.advancedOption = v;
        saveSettings();
        E.showMessage("Advanced Option " + (v ? "On" : "Off"));
      }
    }
  });
}

// Main settings menu
function showSettingsMenu() {
  E.showMenu({
    "": { "title": "MyAppName Settings" },
    "< Back": loadMainMenu,
    "Theme": {
      value: settings.theme,
      options: ["light", "dark"],
      format: v => v,
      onchange: v => { settings.theme = v; saveSettings(); }
    },
    "Vibration": {
      value: settings.vibration,
      format: v => v ? "On" : "Off",
      onchange: v => { settings.vibration = v; saveSettings(); }
    },
    "Brightness": {
      value: settings.brightness,
      min: 0, max: 7, step: 1,
      onchange: v => {
        settings.brightness = v;
        saveSettings();
        Bangle.setLCDBrightness(v);
      }
    },
    "Advanced": showAdvancedMenu, // Nested submenu!
    "Reset": () => {
      settings = { theme: "light", vibration: true, brightness: 7, advancedOption: false };
      saveSettings();
      Bangle.setLCDBrightness(settings.brightness);
      E.showMessage("Settings reset!");
    }
  });
}

// Main app function (example)
function loadMainMenu() {
  g.clear();
  g.setFont("6x8", 2);
  g.drawString("MyAppName", 20, 20);

  // Apply settings
  Bangle.setLCDBrightness(settings.brightness);
  if (settings.vibration) Bangle.buzz();
}

// Register the app in Bangle.js menu
E.showMenu({
  "": { "title": "MyAppName" },
  "Run": loadMainMenu,
  "Settings": showSettingsMenu
});
