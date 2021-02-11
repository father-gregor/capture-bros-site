const OriginalProtonMail = require('protonmail-api');
const puppeteer = require('puppeteer');

module.exports = class ProtonMailX extends OriginalProtonMail {
    constructor(config) {
        super(config);
    }

    async _connect () {
        if (this._browser === undefined) {
            this._browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });
            this._page = await this._browser.newPage();
        }
        await super._connect();
    }
};
