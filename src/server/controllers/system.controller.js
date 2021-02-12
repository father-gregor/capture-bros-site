function pingServer (req, res) {
    return res.status(200).send('Ping received');
}

module.exports = {
    pingServer
};
