import config from 'config';
import server from '../../src/app';

describe('Server', () => {
    it('should return port 3001 when run unit test', async () => {
        expect(server.port.address().port).toEqual(config.port)
    })
});

describe('Database', () => {
    it('should return correct url "test" when run unit test', async () => {
        if (config.get('database').get('dialect') === 'mock') {
            expect(server.db.client.s.url).toEqual(process.env.MONGODB_URL+config.get('database').get('url'))
        }
    })
});
