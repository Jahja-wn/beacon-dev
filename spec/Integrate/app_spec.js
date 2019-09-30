import {finalConfig} from '../../config';
import app from '../../src/app';

describe('Server', () => {
    it('should return port 3001 when run unit test', async () => {
        expect(app.port.address().port).toEqual(finalConfig.port)
    })
});

describe('Database', () => {
    it('should return correct url "test" when run unit test', async () => {
        if (finalConfig.database.dialect=== 'mock') {
            expect(app.db.client.s.url).toEqual(process.env.MONGODB_URL+finalConfig.database.url)
        }
    })
});
