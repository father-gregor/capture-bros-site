const secureConfig = require('../../../config/secure.json');

function checkSecureAccess (req, res, next) {
    if (process.env.NODE_ENV === 'production' && req.query.testing !== secureConfig.secretParam) {
        return res.status(400).send('Secure access denied');
    }

    next();
}

module.exports = {
    checkSecureAccess
};
