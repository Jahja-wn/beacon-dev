(function () {'use strict';}());

import { LocalFile } from '../../data_access_layer';
import { Activity, User} from '../../model';
import fs from 'fs';
import rimraf from 'rimraf';
import { clearDir } from '../../../utility/test_tool/test_resource';
const testpath = './src/core/test/data_access_layer_spec/test_file/';


const daltest = new LocalFile(testpath,[Activity]);
function reset(){
    clearDir(testpath);
}

var testSaveUser1 = new User('59010126', 'Ball');
var testSaveUser2 = new User('59011234', 'Jam');
var testSaveUser3 = new User('59010654', 'Jah');
var testSaveUser4 = new User('59010129', 'Ball');
var testSaveActivity1 = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, '555');
var testSaveActivity2 = new Activity('59010126', 'Ball', 'in', '123432189', 'Try', true, 'Work');
var testSaveActivity3 = new Activity('59010234', 'Jam', 'in', '123122289', 'Fight', true, 'clone');

describe('[LocalFile] =>', () => {
    describe('save(obj)',() => {
        beforeEach(function() {reset()});
        var userFilePath = daltest.getSaveFilePath(User);
        var activityFilePath = daltest.getSaveFilePath(Activity);
        it(`When dal is instantiate with no file, file:${userFilePath} should create file contains 1 obj`,()=>{
            daltest.save(new User('59010126', 'Ball'));
            expect(daltest.getObjFileContent(User)).withContext(`no obj exist obj`).toEqual([{userId:'59010126',name:'Ball'}]);
        });

        it(`When 1 obj already save, file:${userFilePath} should be appended to contain 2 obj with correct sequence`,()=>{
            daltest.save(new User('59010127', 'Jah'));
            daltest.save(new User('59010126', 'Ball'));
            expect(daltest.getObjFileContent(User)).withContext(`1 obj already save`).toEqual([{userId:'59010127',name:'Jah'},{name:'Ball',userId:'59010126'}]);
        });

        it(`when save more than 1 obj of different class, file: ${userFilePath} should contains 1 object and file: ${activityFilePath} should contain 1 obj`,()=>{
            daltest.save(new User('59010126', 'Jah'));
            daltest.save(new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, '222'));
            expect(daltest.getObjFileContent(User)).withContext(`check obj User class`).toEqual([{userId:'59010126',name:'Jah'}]);
            expect(daltest.getObjFileContent(Activity)).withContext(`check obj Activity class`).toEqual([{userId : '59010126', name :  'Ball', type : 'in', timestamp :  '123456789',location : 'Test', askstate : true, plan : '222'}]);
        })
    })

    describe('find(findObj,count,desc)',() => {
        beforeAll(()=>{
            reset();
            daltest.save(testSaveUser1);
            daltest.save(testSaveUser2);
            daltest.save(testSaveUser3);
            daltest.save(testSaveUser4);
            daltest.save(testSaveActivity1);
            daltest.save(testSaveActivity2);
            daltest.save(testSaveActivity3);
        });

        it('when search using all parameter should return every object match pameter', () => {
            expect(daltest.find(new User('59010126', null), null, null)).withContext("should return 1 obj").toEqual([testSaveUser1]);
            expect(daltest.find(new User(null, 'Ball'), null, null)).withContext("should return 2 obj").toEqual([testSaveUser1,testSaveUser4]);
            expect(daltest.find(new User(), null, null)).withContext("should return all obj").toEqual([testSaveUser1,testSaveUser2,testSaveUser3,testSaveUser4]);
            expect(daltest.find(new Activity('59010126', null, null, null, 'Try', null, null),null,null)).withContext('with diffent class that pick 2 properties').toEqual([testSaveActivity2]);
        });

        it('when search using 1 parameter(findObj) should return every object match pameter', () => {
            expect(daltest.find(new User('59010126', null))).withContext("should return 1 obj").toEqual([testSaveUser1]);
            expect(daltest.find(new User(null, 'Ball'))).withContext("should return 2 obj").toEqual([testSaveUser1,testSaveUser4]);
            expect(daltest.find(new User())).withContext("should return all obj").toEqual([testSaveUser1,testSaveUser2,testSaveUser3,testSaveUser4]);
            expect(daltest.find(new Activity('59010126', null, null, null, 'Try', null, null))).withContext('with diffent class that pick 2 properties').toEqual([testSaveActivity2])
        });

        it('when seaching with using count should return number of object match', () => {
            expect(daltest.find(new User(), 1)).withContext("count = 1").toEqual([testSaveUser1]);
            expect(daltest.find(new User(), 2)).withContext("count = 2").toEqual([testSaveUser1,testSaveUser2]);
        });

        it('when seaching with using desc true should return object with sort by oldest to lastest, and reverse if false or default', () => {
            expect(daltest.find(new User(), 2,true)).withContext("desc = true should return 2 newest").toEqual([testSaveUser4,testSaveUser3]);
            expect(daltest.find(new User(), null,true)).withContext("desc = true should return 2 newest").toEqual([testSaveUser4,testSaveUser3,testSaveUser2,testSaveUser1]);
            expect(daltest.find(new User(), 3,false)).withContext("desc = false should return 3 oldest").toEqual([testSaveUser1,testSaveUser2,testSaveUser3]);
            expect(daltest.find(new User(null,null), 3)).withContext("desc = default should return 3 oldest").toEqual([testSaveUser1,testSaveUser2,testSaveUser3]);
        });
    })


    describe('update(updateObj,replace,findObj)',()=>{
        beforeEach(()=>{
            reset();
            // daltest.save(testSaveUser1);
            // daltest.save(testSaveUser2);
            // daltest.save(testSaveUser3);
            // daltest.save(testSaveUser4);
            // daltest.save(testSaveActivity1);
            // daltest.save(testSaveActivity2);
            // daltest.save(testSaveActivity3);
        });

        it('should update new Answer to wanted activity', () => {
            var checkArray = [];
            var testSaveActivity = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, '666');
            var testSaveActivity2 = new Activity('59010126', 'Ball', 'in', '665456789', 'Test55', true, 'free');
            var two = new Activity('8888', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work2');
            var three = new Activity('3333', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work3');
            var four = new Activity('4444', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work4');
            daltest.save(testSaveActivity);
            daltest.save(testSaveActivity2);
            daltest.save(two);
            daltest.save(three);
            daltest.save(four);
            var testfindobj = new Activity('59010126',null,null,null,null,null,null);
            var testupdateobj = new Activity(null,null,null,null,null,null,'gotoPlay');
    
            daltest.update(testupdateobj,null,testfindobj);
    
            var mustbe = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, 'gotoPlay');
            var mustbe2 = new Activity('59010126', 'Ball', 'in', '665456789', 'Test55', true, 'gotoPlay');
            checkArray.push(mustbe);
            checkArray.push(mustbe2);
            var findobj2 = new Activity('59010126',null,null,null,null,null,null);
            var find2 = daltest.find(findobj2,null,null);
            expect(find2.length).toEqual(2);
            for(var i in find2){
                expect(find2[i]).toEqual(checkArray[i]);
            }
        });
    
        it('should replace whole activity property', () => {
            if (fs.existsSync(testpath)) {
                rimraf.sync(testpath);
            }
            var testSaveActivity = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, '666');
            var testSaveActivity2 = new Activity('59010126', 'Ball', 'in', '665456789', 'Test55', true, 'free');
            var two = new Activity('8888', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work2');
            var three = new Activity('3333', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work3');
            var four = new Activity('4444', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work4');
            daltest.save(testSaveActivity);
            daltest.save(testSaveActivity2);
            daltest.save(two);
            daltest.save(three);
            daltest.save(four);
            
            var testfindobj = new Activity('59010126',null,null,null,null,null,null);
    
            var testupdateobj = new Activity('59010126',null,null,null,null,null,'gotoPlay');
            daltest.update(testupdateobj,true,testfindobj);
    
            var mustbe = new Activity('59010126',null,null,null,null,null, 'gotoPlay');
            var findobj2 = new Activity('59010126',null,null,null,null,null,null);
            var find2 = daltest.find(findobj2,null,null);
            expect(find2.length).toEqual(2);
            for(var i in find2){
                expect(find2[i]).toEqual(mustbe);
            }
        });
    })

});
