const ProtonMail = require('protonmail-api');
const {body, validationResult} = require('express-validator');

const secureConfig = require('../../../config/secure.json');
const clientConfig = require('../../../config/client.json');

const protonCredentials = {
    username: secureConfig.protonmail.username,
    password: secureConfig.protonmail.password
};

async function testEmailSend (req, res) {
    if (process.env.NODE_ENV === 'production' && req.query.testing !== secureConfig.secretParam) {
        return res.status(400).send('Testing denied');
    }

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

async function sendContactForm (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                reason: errors.array()[0].msg
            });
        }
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
        return res.status(500).json({status: 'error', reason: `Internal error. Please try again later or contact directly via our email ${clientConfig.general.contactEmail}`});
    }
}

module.exports = {
    testEmailSend,
    validateContactForm,
    sendContactForm
};
