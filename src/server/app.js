const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const formData = require('express-form-data');

const routes = require('./routes/routes');

const app = express();

app.use(logger('dev'));
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    optionsSuccessStatus: 200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(formData.parse({uploadDir: '/', autoClean: true}));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());
app.use(cookieParser());
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        return res.json({
            message: err.message,
            error: err
        });
    });
}
else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        return res.json({
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;