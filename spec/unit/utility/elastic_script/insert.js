import { Client as ESClient } from 'elasticsearch';
import { Activity, User, Location } from "../../core/model/index";
import { isUndefined } from 'util';

import { logger } from '../../logger';
import { ElasticService } from '../../core/service/elastic_service';
const elastic = new ElasticService();

let allUsers = [new User('5988077', 'Ball'), new User('5988079', 'JA'), new User('5988034', 'JAM'), new User('5688016', 'Dutch')];
allUsers[0].url = "https://profile.line-scdn.net/0h0UEumszrb3p4DEBwoiYQLURJYRcPImkyAG4lGggIOE5XOXt-QT50FFRYMB0Ba3h-FGkgFA9cOE1X";
allUsers[1].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
allUsers[2].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
allUsers[3].url = "https://profile.line-scdn.net/0h0UEumszrb3p4DEBwoiYQLURJYRcPImkyAG4lGggIOE5XOXt-QT50FFRYMB0Ba3h-FGkgFA9cOE1X";
let allMessages = ['no plan', 'working', 'sleeping', 'have lunch', 'debugging'];
let allLocations = [
    {
        'locationName': 'Chidlom Site',
        "point": {
            "lat": 13.783080,
            "lon": 100.546186
        }
    },
    {
        'locationName': 'Dimension Data Office, Asok',
        "point": {
            "lat": 13.732993,
            "lon": 100.560407
        }
    },
    {
        'locationName': 'BBL',
        "point": {
            "lat": 13.742993,
            "lon": 100.561407
        }
    },
    {
        'locationName': 'KK',
        "point": {
            "lat": 13.792993,
            "lon": 100.591407
        }
    },
    {
        'locationName': 'SiamPiwat',
        "point": {
            "lat": 13.762993,
            "lon": 100.661407
        }
    }
];






let client = new ESClient({ host: 'localhost:9200', log: 'info' });

function createRandomActivity(date, pickedUser) {

    // let pickedUser = allUsers[Math.round(Math.random()*4)];
    let randomMessageIndex = Math.round(Math.random() * 4);
    let pickedMessage = allMessages[randomMessageIndex];
    let pickedLocation = allLocations[Math.round(Math.random() * 4)];
    let randomHour = Math.round(Math.random() * 60 * 60 * 1000 * 3); // random in 3 hour range
    // let currentDate = new Date().getTime();
    date.setTime(randomHour + date.getTime());
    if (isUndefined(pickedMessage)) console.log(randomMessageIndex);
    return new Activity(pickedUser.userId, pickedUser.name, 'in', date.getTime(), new Location("asdfasdf", pickedLocation.locationName, pickedLocation.point), true, pickedMessage, pickedUser.url);
}

async function insertRandomIndex(date, month, year, user) {
    let gp7Date = new Date(year, month - 1, date, 7);
    let ranAct = createRandomActivity(gp7Date, user);
    await elastic.save(ranAct);
}

async function insertSequenced(){
    for (let j = 1; j < 30; j++) {
        for (let i = 0; i < allUsers.length; i++) {
            insertRandomIndex(i, 7, 2019, allUsers[i]).catch((err) => { console.log(err); });
        }
    }
}

insertSequenced()



