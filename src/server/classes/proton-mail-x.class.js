const OriginalProtonMail = require('protonmail-api');
const puppeteer = require('puppeteer');

module.exports = class ProtonMailX extends OriginalProtonMail {
    static async connect (config) {
        const protonMail = new ProtonMailX(config);
        await protonMail._connect();
        return protonMail;
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
            console.log('CONNECTED VIA PROTON MAIL X');
            this._page = await this._browser.newPage();
        }
        await super._connect();
    }
};
