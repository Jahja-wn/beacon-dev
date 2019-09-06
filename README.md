# Linebot-beacon-DD
## Topics
- Requirement
- Pre-require Installation
- Getting started
## Requirement
- Node js v.10.16.0

- Elasticsearch

- MongoDB

- Heroku
## Pre-require Installation
 - ### Raspberry pi device

Set up raspberry pi with WiFi  by follow the link below

https://medium.com/@supachaija/how-to-setup-raspberry-pi-zero-w-headless-with-wifi-466c7a9e4a9b

Install Bluetooth and library with command

```
$ sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev 
```
Install Node.js and NPM for run Simple Beacon with Node.js

```
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```

Install Git for clone Simple Beacon repository

```
$ sudo apt-get install git 
```
 - ### Line beacon bot 

```
git clone https://github.com/Jahja-wn/beacon-dev.git
npm install
```

## Getting started

  Create a Line bot  => https://developers.line.biz

  Define hardware id for beacon => https://manager.line.biz/beacon/register#/


  Before run this project, you must chage value in config file at src/core/config.js
by create  enviroment variable of channelAccessToken, channelSecret and change ReportGroupId ,uri

```
module.exports = {
	url:"mongodb+srv://<dbusername>:<dbpassword>@<dburl>",
	port:process.env.PORT ||8000,
	channelAccessToken= process.env.channelAccessToken,
	channelSecret= process.env.channelSecret,
	ReportGroupId: "<groupID>",
};
```
  After we have prepared the software then clone line simple beacon in our raspberry pi and install dependencies with NPM   run script with hardware Id

```
$ git clone https://github.com/line/line-simple-beacon.git
$ cd line-simple-beacon/tools/line-simplebeacon-nodejs-sample/
$ npm install
$ sudo ./simplebeacon.js --hwid= <your hwid>
```

  Then, you can run this project by this command.
```
npm start
```


  Config the webhook url in the line developer console => https://developers.line.biz/

## Structure
```
src
├───core
│   ├───data_access_layer
│   ├───model
│   ├───service
│   └───test
│       ├───data_access_layer_spec
│       └───service_spec
│           ├───getlocation_service_test_file
│           └───test_file
├───public
│   ├───css
│   ├───fonts
│   │   ├───font-awesome-4.7.0
│   │   │   ├───css
│   │   │   ├───fonts
│   │   │   ├───less
│   │   │   └───scss
│   │   └───poppins
│   └───js
├───routes
├───utility
│   ├───elastic_script
│   └───test_tool
└───views
```

## Model , Data access layer and Process 

 - ### Model

    Create schemas map to a MongoDB collection.

###### user model 

```
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userId: String,
    displayName: String,
    firstName: String,
    lastName: String,
    nickName: String
})
const userModel = mongoose.model('users', userSchema);
module.exports = userModel
```

###### activity model

By default mongo dates are stored in UTC format, we need to install mongoose-timezone for change UTC format into our current timezone before store in the database.

```
npm install mongoose-timezone --save
```
```
const timeZone = require('mongoose-timezone');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const activitySchema = new Schema({
    userId: String,
    displayName: String,
    type: String,
    timestamp: Date,
    subDocument: {
        subDate: {
            type: Date
        }
    },
    location: Object,
    askstate: Boolean,
    plan: String,
    url: String
})
activitySchema.plugin(timeZone, { paths: ['timestamp', 'subDocument.subDate'] });
const activityModel = mongoose.model('activities',activitySchema)
module.exports = activityModel

```
###### location model

We need to add location informations such as hardwareID , location's Name , latitude and longitude in MogoDB for retrieve the data

```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({
    hardwareID : String,
    locationName : String,
    point : Object
})
const locationModel = mongoose.model('locations',locationSchema)

module.exports = locationModel
```

 - ### Data access layer
  
   -   save ( obj )


  
   - find ( findObj, model, sortOptions, limit )


   - update ( model, findobj, replace, sortOption )
  