const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const ProtonMailX = require('../classes/proton-mail-x.class');
const {body, validationResult} = require('express-validator');

const clientConfig = require('../../../config/client.json');

const protonCredentials = {
    username: process.env.PROTON_EMAIL,
    password: process.env.PROTON_PASSWORD
};
const emailList = process.env.EMAIL_LIST.split(',');
const contactFormEmailTemplate = fs.readFileSync(path.join(__dirname, '../views/contact-email.html'), {encoding: 'utf-8'});

async function testEmailSend (req, res) {
    try {
        const proton = await ProtonMailX.connect(protonCredentials);
        const {data, html} = getEmailContactFormData({
            company: 'Test Company',
            fullname: 'Test Client',
            email: 'test@example.com',
            category: 'Test Category',
            message: 'Test\nMulti\nLines'
        });

        const emailRes = await proton.sendEmail({
            to: emailList[0],
            subject: `Testing protonmail API - sended on ${data.submitted}`,
            body: html
        });

        proton.close();
        return res.status(200).send(`Successfully sended on ${emailRes.time.toLocaleString('en-US')}`);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({...err});
    }
}

function validateContactForm () {
    return [
        body('email', 'No email specified!').exists(),
        body('email', 'Invalid email!').isEmail().normalizeEmail(),
        body('message', 'No message specified!').exists().trim().escape()
    ];
}

async function getMissedEmails (req, res) {
    const dir = path.join(__dirname, '/../missed-emails/');
    const missedEmailFiles = fs.readdirSync(dir);
    const missedEmails = [];
    const errors = [];

    for (let filename of missedEmailFiles) {
        try {
            if (!filename.startsWith('missed-email')) {
                continue;
            }
            const missedEmailJSON = fs.readFileSync(dir + filename, {encoding: 'utf-8'});
            missedEmails.push({...JSON.parse(missedEmailJSON), filename});
        }
        catch (err) {
            errors.push(`Failed to open file ${filename}`);
            console.log(err);
        }
    }
    return res.json({missedEmails, errors});
}

async function sendContactForm (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            reason: errors.array()[0].msg
        });
    }

    try {
        const {data, html} = getEmailContactFormData(req.body);

        if (process.env.NODE_ENV === 'production') {
            const proton = await ProtonMailX.connect(protonCredentials);

            for (let emailTo of emailList) {
                await proton.sendEmail({
                    to: emailTo,
                    subject: `New contact form submission - ${data.category} - ${data.company || data.fullname || data.email}`,
                    body: html
                });
            }

            proton.close();
        }
        else {
            console.log('HTML:', html);
            console.log('BODY:', data);
        }

        return res.status(200).json({status: 'success'});
    }
    catch (err) {
        console.error(err);
        fs.writeFile(`${__dirname}/../missed-emails/missed-email-${req.body.email}-${Date.now()}.json`, JSON.stringify(req.body, null, 4), {}, (err) => {
            if (!err) {
                return;
            }

            console.error(err);
            console.log('\nFailed to save missed email, fallback to logging directly to console:');
            console.dir(req.body, {depth: 5});
        });
        return res.status(400).json({status: 'error', reason: `Internal error. Please try again later or contact directly via ${clientConfig.general.contactEmail}`});
    }
}

function getEmailContactFormData (input) {
    const data = {
        ...input,
        submitted: new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})
    };
    const html = _.template(contactFormEmailTemplate)({data});
    return {data, html};
}

module.exports = {
    testEmailSend,
    getMissedEmails,
    validateContactForm,
    sendContactForm
};
