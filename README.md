# Linebot-beacon-DD
## Topics
- Requirement
- Pre-require Installation
- Getting started
- Structure
- Using API
- Model , Data access layer and Process 
  
## Requirement
- Node js v.10.16.0

- Elasticsearch

- MongoDB

- Heroku
## Pre-require Installation
 - ### Raspberry pi device

Set up raspberry pi with WiFi  by follow the link below

https://medium.com/@supachaija/how-to-setup-raspberry-pi-zero-w-headless-with-wifi-466c7a9e4a9b

Install Git for clone Beacon repository

```
$ sudo apt-get install git 
```


Clone shell script

```
git clone https://github.com/ballkittipat272/install-Line-Beacon-DD.git
```

Install Beacon with command

```
cd install-Line-Beacon-DD
chmod 775 setup.sh
sed -i -e 's/\r$//' setup.sh
./setup.sh
```
 - ### Line beacon bot 

```
git clone https://github.com/Jahja-wn/beacon-dev.git
npm install
```

## Getting started

  Create a Line bot  => https://developers.line.biz

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
  Define hardware id for beacon => https://manager.line.biz/beacon/register#/

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

## Using API
  server: Express

  view engine : ejs

  - GET /history
  - GET /liff/userprofile
  - POST /liff/gethistory
  - POST /liff/submit
  - POST /webhook
  
### GET /history

This API will rendering history page.
### GET /liff/userprofile

This API will rendering set user's profile page.

### POST /liff/gethistory

This API use for find data in the database by userId  and show the data on history page.

Request body :

```
{ userId: '123456789' }
```

Response: 
```
//if successful 
return status 200 

//if unsuccessful 
return status 500 with error message
```

### POST /liff/submit

This API use for save user's information.
Request body :
```
 {
  userId: '123456789',
  displayName: 'Bob',
  firstName: 'Bobb',
  lastName: 'Bobbb',
  nickName: 'Bobbbb'
}
```
Response: 
```
//if successful 
return status 200 

//if unsuccessful 
return status 500 with error message
```
### POST /webhook

This API use for receive events from line.

Request body :
``` 
events: [
    {
      replyToken: '00000000000000000000000000000000',
      type: 'message',
      timestamp: 1568006874500,
      source: [Object],
      message: [Object]
    },
    {
      replyToken: 'ffffffffffffffffffffffffffffffff',
      type: 'message',
      timestamp: 1568006874500,
      source: [Object],
      message: [Object]
    }
  ]
```
Response: 
```
// if successful 
{ 
  replyToken: '00000000000000000000000000000000',
  type: 'message',
  timestamp: 1568006877355,
  source: { type: 'user', userId: 'Udeadbeefdeadbeefdeadbeefdeadbeef' },
  message: { id: '100001', type: 'text', text: 'Hello, world' }
}

{
  replyToken: 'ffffffffffffffffffffffffffffffff',
  type: 'message',
  timestamp: 1568006877355,
  source: { type: 'user', userId: 'Udeadbeefdeadbeefdeadbeefdeadbeef' },
  message: { id: '100002', type: 'sticker', packageId: '1', stickerId: '1' }
}

// if unsuccessful
return status 500 
```

## Model , Data access layer and Process 

 - ### Model

    Create schemas map to a MongoDB collection.

#### user model

```
    userId: String,
    displayName: String,
    firstName: String,
    lastName: String,
    nickName: String
```

#### activity model

By default mongo dates are stored in UTC format, we need to install mongoose-timezone for change UTC format into our current timezone before store in the database.

```
npm install mongoose-timezone --save
```
```
    userId: String,
    displayName: String,
    type: String,
    timestamp: Date,
    location: Object,
    askstate: Boolean,
    plan: String,
    url: String
```
#### location model

We need to add location informations such as hardwareID , location's Name , latitude and longitude in MogoDB for retrieve the data

```
    hardwareID : String,
    locationName : String,
    point : {
      coordinates: [Number] // [lon,lat]
    }
```

 - ### Data access layer
  
  #### save ( obj )
  Use for record necessary information such as user , location , activity information

  #### find ( filter, model, sortOption, limit )

  Use for retrieve information that needs to be considered .

  ```
  sortOptions pattern :
  
    const sortOption = { field: 'value'}  or  { field: 1 }
  
    values allowed are asc, desc, ascending, descending, 1, and -1.
  ```

  #### update ( model, condition, replace, sortOption )

  ``` 
  sortOption pattern : 
    
    const sortOption = { new: true, sort: { "_id": -1 } };

  new: bool => if true, return the modified document rather than the original, defaults to false.
  ```

- ### Service
  
#### beacon_service

Handle When the user has a Bluetooth connection with the line beacon. By comparing your user id with the user id that kept in the database.
if you are a group member, the program will work according to the specified conditions.

#### conversation_service

Use for Handle received messages from the user and  call  callback function.

#### message_service

Handle about text messaging , message format.



  
