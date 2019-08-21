(function () {'use strict';}());
import * as fs from 'fs';
var locationDir = './resource/location.json';
import { logger } from '../../logger';

function getLocation(hwid) {
    if (fs.existsSync(this.locationDir)) {
        var data = fs.readFileSync(this.locationDir);
        var dataArray = JSON.parse(data);
        for (var i in dataArray) {
            if (dataArray[i].hardwareID == hwid) {
                return dataArray[i].LocationName;
            }
        }
        return ("This Hardware ID is not saved Location");

    } else {
        console.log("No Location File");
    }
}


class GetLocationService {
    constructor() {
        this.getLocation = getLocation;
        this.locationDir = locationDir;
    }
}

export { GetLocationService }