const fs = require('fs');
const path = require('path');
const puppeteerPath = path.resolve('node_modules/protonmail-api/node_modules/puppeteer');
console.log(puppeteerPath);
const isExists = fs.existsSync(puppeteerPath);
console.log(`Postinstall script: folder ${puppeteerPath} exists - `, isExists);
fs.rmdirSync(path.resolve('node_modules/protonmail-api/node_modules/puppeteer'), {recursive: true});
console.log('Postinstall script: finished, folder exists - ', fs.existsSync(puppeteerPath));
