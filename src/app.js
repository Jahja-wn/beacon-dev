(function () { 'use strict'; }());
import users from './core/model';
import { LocalFile } from './core/data_access_layer/local_file';

import { ConversationService, ElasticService, BeaconService, MessageService } from './core/service';
import { Client, middleware } from '@line/bot-sdk';
import { logger, Log_config } from './logger';
import config from './core/config';

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const logconfig = Log_config;               //const config = require('./core/config.js');
const client = new Client(config);          // create LINE SDK client
const dal = new LocalFile();
const elastic = new ElasticService();
const messageService = new MessageService(new Client(config));
const conversationService = new ConversationService(dal, messageService, elastic, config.AnswerAlertDuration);
const beaconService = new BeaconService(conversationService, messageService, dal, elastic);

const mongoose = require('mongoose');
const uri = "mongodb+srv://Jahja-wn:1234@cluster0-dcsni.azure.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('connected', function () {
  console.log('Mongoose connected');
  console.log(beaconService.dal)
});
db.on('error', function (err) {
  console.log('Mongoose error: ' + err);
});


app.use(bodyParser.urlencoded({ extended: false }));
app.get('/userprofile', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/submit', (req, res) => {
  var saveUser = new users({
    userId: req.body.useridfield,
    displayName: req.body.displayname,
    firstName: req.body.Firstname,
    LastName: req.body.Lastname,
    nickName: req.body.Nickname
  });
  dal.save(saveUser);
  //elastic.elasticsave(saveUser);
});
// app.use(.bodyParser.JSON);
// app.post('/userprofile',bodyParser.json() ,(req, res) => {
//   console.log(req.body); 
//   var data = req.body;
//   fs.writeFileSync("./resource/profile.json", JSON.stringify(data, null, 4),{flag:'w'});
//   return res.status(200).send('hello world');
//   });

// webhook callback
app.post('/webhook', middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    logger.error(res);
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(req.body.events.map(event => {
    logger.info(event);
    // check verify webhook event
    if (event.replyToken === '00000000000000000000000000000000' ||
      event.replyToken === 'ffffffffffffffffffffffffffffffff') {
      return;
    }
    return handleEvent(event);
  }))
    .then(() => res.end())
    .catch((err) => {
      logger.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      return conversationService.handleInMessage(event.message, event.source.userId);

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return logger.info(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'join':
      return console.log(event.source.groupId);

    case 'memberJoined':
      return messageService.sendMessage(event.joined.members[0].userId, "please insert your information \n line://app/1589363163-1oVLQwQk");

    case 'memberLeft':
      return;

    case 'leave':
      return logger.info(`Left: ${JSON.stringify(event)}`);

    case 'beacon':
      client.getProfile(event.source.userId)
        .then((profile) => {
          beaconService.handleBeaconEvent(event.source.userId, profile.displayName, event.timestamp, event.beacon.hwid, profile.pictureUrl);
        }).catch((err) => {
          logger.error(err);
        });
      return;

    default:
      logger.error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

app.listen(config.port, () => {
  logger.info(`listening on ${config.port}`);
});
