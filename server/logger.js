const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, 'logs');
const logFile = path.join(logsDir, 'activity.log');

if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

function logActivity(username, activity) {
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} | ${username || 'anonymous'} | ${activity}\n`;
  fs.appendFile(logFile, entry, (err) => {
    if (err) console.error('Failed to write activity log:', err);
  });
}

module.exports = { logActivity, logFile };
