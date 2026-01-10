// settings.js
// Generic Settings Menu Template for Bangle.js 2

const SETTINGS_FILE = "myapp.settings.json";

// Load existing settings or defaults
let settings = Object.assign({
  enabled: true,     // Row 1 (boolean)
  mode: 1            // Row 3 (numeric option)
}, require("Storage").readJSON(SETTINGS_FILE, true) || {});

// Save helper
function saveSettings() {
  require("Storage").writeJSON(SETTINGS_FILE, settings);
}

/* ---------------------------
   Sub-menus (placeholders)
--------------------------- */

function showSubMenu2() {
  E.showMenu({
    "": { title: "Sub Menu 2" },
    "< Back": () => showMainMenu()
    // Populate later
  });
}

function showSubMenu4() {
  E.showMenu({
    "": { title: "Sub Menu 4" },
    "< Back": () => showMainMenu()
    // Populate later
  });
}

function showSubMenu5() {
  E.showMenu({
    "": { title: "Sub Menu 5" },
    "< Back": () => showMainMenu()
    // Populate later
  });
}

/* ---------------------------
   Main Settings Menu
--------------------------- */

function showMainMenu() {
  E.showMenu({
    "": { title: "Settings" },

    /* Row 1: Boolean tick box */
    "Enabled": {
      value: settings.enabled,
      onchange: v => {
        settings.enabled = v;
        saveSettings();
      }
    },

    /* Row 2: Nested submenu */
    "Sub Menu 2": () => showSubMenu2(),

    /* Row 3: Two-option selector (text shown, number stored) */
    "Mode": {
      value: settings.mode,
      min: 1,
      max: 2,
      step: 1,
      format: v => v === 1 ? "Option 1" : "Option 2",
      onchange: v => {
        settings.mode = v;
        saveSettings();
      }
    },

    /* Row 4: Nested submenu */
    "Sub Menu 4": () => showSubMenu4(),

    /* Row 5: Nested submenu */
    "Sub Menu 5": () => showSubMenu5(),

    "< Back": () => load() // return to launcher/app
  });
}

/* ---------------------------
   Entry point
--------------------------- */

showMainMenu();
