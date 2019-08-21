'use strict';

import {GetLocation_service} from '../../service/index'

const getlocationservice = new GetLocation_service();
getlocationservice.locationDir = './src/core/test/service_spec/getlocation_service_test_file/location.json';
console.log(new GetLocation_service().locationDir);
console.log(getlocationservice.locationDir);

describe('answer', () => {


    it('should return Location by input hardware id', () => {
        let data = getlocationservice.getLocation("012c75d8a3");
        expect(data).toEqual("Dimension Data Office, Asok");
    });


    it('should return "This Hardware ID is not saved Location" if hardware id is not registered', () => {
        let data = getlocationservice.getLocation("555555");
        expect(data).toEqual("This Hardware ID is not saved Location");
    });


    
    it('should return "This Hardware ID is not saved Location" if input null', () => {
        let data = getlocationservice.getLocation(null);
        expect(data).toEqual("This Hardware ID is not saved Location");
    });


});