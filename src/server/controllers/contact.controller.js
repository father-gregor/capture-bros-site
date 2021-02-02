const fs = require('fs');
const ProtonMail = require('protonmail-api');
const {body, validationResult} = require('express-validator');

const secureConfig = require('../../../config/secure.json');
const clientConfig = require('../../../config/client.json');

const protonCredentials = {
    username: secureConfig.protonmail.username,
    password: secureConfig.protonmail.password
};

async function testEmailSend (req, res) {
    try {
        const proton = await ProtonMail.connect(protonCredentials);

        const emailRes = await proton.sendEmail({
            to: secureConfig.testingEmail,
            subject: `Testing protonmail API - sended on ${new Date().toISOString()}`,
            body: 'Test data'
        });

        proton.close();
        return res.status(200).send(`Successfully sended on ${emailRes.time.toISOString()}`);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({...err});
    }
}

function validateContactForm () {
    return [
        body('email', 'No email specified!').exists(),
        body('email', 'Invalid email!').isEmail(),
        body('message', 'No message specified!').exists()
    ];
}

async function getMissedEmails (req, res) {
    const dir = `${__dirname}/../missed-emails/`;
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
        /*
        const proton = await ProtonMail.connect(protonCredentials);
    
        await proton.sendEmail({
            to: secureConfig.testingEmail,
            subject: 'TEst protonmail API',
            body: 'Test data'
        });
    
        proton.close();*/
        console.log(req.body);
        return res.status(200).json({status: 'success'});
    }
    catch (err) {
        console.error(err);
        fs.writeFile(`${__dirname}/../missed-emails/missed-email-${req.body.email}-${Date.now()}.json`, JSON.stringify(req.body, null, 4), {}, (err) => {
            if (!err) {
                return;
            }

            console.log(err);
            console.log('\nFailed to save missed email, fallback to logging directly to console:');
            console.dir(req.body, {depth: 5});
        });
        return res.status(400).json({status: 'error', reason: `Internal error. Please try again later or contact directly via ${clientConfig.general.contactEmail}`});
    }
}

module.exports = {
    testEmailSend,
    getMissedEmails,
    validateContactForm,
    sendContactForm
};
