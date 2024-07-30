const morgan = require('morgan');
const winston = require('winston');
const logger = require('./logger-cofing');
const { format } = winston;

const stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

const morganFormat = 'combined';

const morganLogger = morgan(morganFormat, { stream });

module.exports = morganLogger;
