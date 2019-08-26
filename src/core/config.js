(function () { 'use strict'; }());

const port = process.env.PORT || 7000;

module.exports = {
    port,
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
    ReportGroupId: "C8fbee37d52c847f6aa8e2a22950e96be",
    AnswerAlertDuration: 5000, //ms,
    ElasticConfig: {
        host: 'localhost:9200',
        log: "info"
    }
};