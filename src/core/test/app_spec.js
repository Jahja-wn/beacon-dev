import config from  '../config';
import server from '../../app';

describe('Server', ()=>{
    it('tests that server is running current port', async()=>{
        expect(server.port).toEqual(config.port)

    })
});