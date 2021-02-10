function checkSecureAccess (req, res, next) {
    if (process.env.NODE_ENV === 'production' && req.query.testing !== process.env.SECRET_PARAM) {
        return res.status(400).send('Secure access denied');
    }

    next();
}

module.exports = {
    checkSecureAccess
};
