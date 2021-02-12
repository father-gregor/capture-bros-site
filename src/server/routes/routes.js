const express = require('express');
const router = express.Router();

const GeneralMiddleware = require('../middlewares/general.middleware');

const SystemController = require('../controllers/system.controller');
const ContactController = require('../controllers/contact.controller');

router.route('/')
    .get((req, res) => {
        return res.status(200).send();
    });

router.route('/api/systen/ping')
    .get(
        SystemController.pingServer
    );

router.route('/api/contact/test-email')
    .get(
        GeneralMiddleware.checkSecureAccess,
        ContactController.testEmailSend
    );

router.route('/api/contact/missed')
    .get(
        GeneralMiddleware.checkSecureAccess,
        ContactController.getMissedEmails
    );

router.route('/api/contact/submit-form')
    .post(
        ContactController.getContactFormValidators(),
        ContactController.sendContactForm
    );

module.exports = router;
