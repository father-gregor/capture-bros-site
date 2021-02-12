const fs = require('fs');
const path = require('path');
fs.rmdirSync(path.join(__dirname, '../node_modules/protonmail-api/node_modules/puppeteer'), {recursive: true});
