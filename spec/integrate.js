import Jasmine from 'jasmine'

const jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/integrate.json');
jasmine.execute();
