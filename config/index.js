
// module variables
const config = require('./config.json');
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];

const finalConfig = {
    ...environmentConfig,
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
    reportGroupId: process.env.reportGroupId,
    AnswerAlertDuration:5000
}
export {finalConfig};

