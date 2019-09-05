(function () { 'use strict'; }());
import moment from 'moment';
import config from '../config';
import { logger } from '../../logger';


async function sendMessage(id, messageContent) {
    if (typeof messageContent === 'string') {
        messageContent = {
            type: 'text',
            text: messageContent
        };
    }
    try {
        await this.client.pushMessage(id, messageContent);
    }
    catch (err) {
        logger.error("Fail while try to send message: ", err);
        logger.info("Message Content: ", messageContent);
    }
}

async function sendWalkInMessage(activity, userprofile) {
    logger.info(`send WalkInMessage with Activity: ${JSON.stringify(activity)}  ${JSON.stringify(userprofile)} `);
    let message = this.createWalkInMessage(activity, userprofile)
    await this.sendMessage(config.ReportGroupId, message);
}

async function sendConfirmMessage(userid) {
    let message = this.confirmMessage();
    await this.sendMessage(userid, message);
}

function confirmMessage() {
    const confirmMessage = {
        "type": "template",
        "altText": "this is a confirm template",
        "template": {
            "type": "confirm",
            "actions": [
                {
                    "type": "message",
                    "label": "Yes",
                    "text": "Yes"
                },
                {
                    "type": "message",
                    "label": "No",
                    "text": "No"
                }
            ],
            "text": "would you like to clock out ?"
        }
    }

    return confirmMessage;
}

function createWalkInMessage(activity, userprofile) {//format of the sent message
    const flexMessage = {
        "type": "flex",
        "altText": "this is a flex message",
        "contents": {
            "type": "bubble",
            "hero": {
                "type": "image",
                "url": activity.url,
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "cover"
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "md",
                "contents": [
                    {
                        "type": "text",
                        "text": activity.displayName + " " + "(" + userprofile.nickName + ")",
                        "wrap": true,
                        "weight": "bold",
                        "gravity": "center",
                        "size": "xl"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "lg",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Date",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 1
                                    },
                                    {
                                        "type": "text",
                                        "text": moment(activity.timestamp).format('MMMM Do YYYY, h:mm:ss a'),
                                        "wrap": true,
                                        "size": "sm",
                                        "color": "#666666",
                                        "flex": 4
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Type",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 1
                                    },
                                    {
                                        "type": "text",
                                        "text": activity.type,
                                        "wrap": true,
                                        "size": "sm",
                                        "color": "#666666",
                                        "flex": 4
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Place",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 1
                                    },
                                    {
                                        "type": "text",
                                        "text": activity.location.locationName,
                                        "wrap": true,
                                        "color": "#666666",
                                        "size": "sm",
                                        "flex": 4
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Ans",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 1
                                    },
                                    {
                                        "type": "text",
                                        "text": activity.plan,
                                        "wrap": true,
                                        "color": "#666666",
                                        "size": "sm",
                                        "flex": 4
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    };

    return flexMessage;
}



class MessageService {
    constructor(lineClient) {
        this.client = lineClient;
        this.sendMessage = sendMessage;
        this.sendWalkInMessage = sendWalkInMessage;
        this.createWalkInMessage = createWalkInMessage;
        this.sendConfirmMessage = sendConfirmMessage;
        this.confirmMessage = confirmMessage;
    }
}


export {
    MessageService
};