import Jasmine from 'jasmine'

const jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/unit.json');
jasmine.execute();
