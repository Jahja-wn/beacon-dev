global.__basedir = __dirname;

import {logger} from './logger';
import router from './routes';
import {finalConfig} from '../config';
import db from './database'
import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import ejs from 'ejs'
const app = express();
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)
const listen = app.listen(finalConfig.port, () => {
    logger.info(`listening on ${finalConfig.port}`);
});

module.exports = app;
module.exports.port = listen;
module.exports.db = db;
