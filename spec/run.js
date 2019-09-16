import Jasmine from 'jasmine'
import config from 'config'

const jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.execute();
