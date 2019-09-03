import { logger } from './logger';
import router from './routes'
import config from './core/config';
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Jahja-wn:1234@cluster0-dcsni.azure.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log('monggoose connected'))
    .catch((err) => console.log('mongoose unconnected:', err))
const ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)
app.listen(config.port, () => {
    logger.info(`listening on ${config.port}`);
});


