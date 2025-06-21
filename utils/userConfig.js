// utils/userConfig.js
const fs   = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'data', 'usernames.json');

function loadConfigs() {
  if (!fs.existsSync(FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveConfigs(cfg) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(cfg, null, 2), 'utf8');
}

/**
 * Get the 3‐slot array for a user, creating defaults if needed.
 */
function getUserSlots(userId) {
  const cfg = loadConfigs();
  if (!cfg[userId]) {
    cfg[userId] = { slots: [null, null, null] };
    saveConfigs(cfg);
  }
  return cfg[userId].slots;
}

/**
 * Set a particular slot (1–3) for a user.
 */
function setUserSlot(userId, slotNum, username) {
  const cfg = loadConfigs();
  if (!cfg[userId]) cfg[userId] = { slots: [null, null, null] };
  cfg[userId].slots[slotNum - 1] = username;
  saveConfigs(cfg);
}

/**
 * List all slots for a user.
 */
function listUserSlots(userId) {
  const cfg = loadConfigs();
  return (cfg[userId]?.slots) || [ null, null, null ];
}

module.exports = { getUserSlots, setUserSlot, listUserSlots };
