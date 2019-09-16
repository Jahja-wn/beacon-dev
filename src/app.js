import {logger} from './logger';
import router from './routes';
import config from 'config';
import db from './database'
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');

const ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)
const listen = app.listen(config.get('port'), () => {
    logger.info(`listening on ${config.get('port')}`);
});

module.exports = app;
module.exports.port = listen;
module.exports.db = db;
