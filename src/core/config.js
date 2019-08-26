(function () { 'use strict'; }());

const port = process.env.PORT || 7000;
const uri=process.env.MONGODB_URL;
module.exports = {
    uri,
    port,
    channelAccessToken: "azyN3SbF0UaXDTeN0IMXwbc5HvDxq7HnuM8Z/YHenOlq3KbblMmR5wYa+mY5ZTUyIAKG1PVlEXVQwev6GA51KrSxAFWg9VX2XkuMV66is0G3B7fotyOHfU8TuMoehB96vtrqhHX0hWjOBDCp5y2FGwdB04t89/1O/w1cDnyilFU=",
    channelSecret: "b01c41c0e015e2d56e56edb0f9b02860",
    ReportGroupId: "C8fbee37d52c847f6aa8e2a22950e96be",
    AnswerAlertDuration: 5000, //ms,
    ElasticConfig: {
        host: 'localhost:9200',
        log: "info"
    }
};