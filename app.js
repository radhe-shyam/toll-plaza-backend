const express = require('express');
const cors = require('cors');
const response = require('./utils/response');
const routes = require('./modules/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use((req, res, next) => response.sendErrorResponse(req, res, 404, `Path Not found - ${req.url}`, new Error('Not Found')));

app.use((err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        return response.sendWrongInputResponse(req, res, err.error.toString(), err);
    }
    return response.sendErrorResponse(req, res, 500, 'Something went wrong', err);
});

module.exports = app;