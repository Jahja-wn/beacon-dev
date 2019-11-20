(function () { 'use strict'; }());
import moment from 'moment';
import { finalConfig } from '../../../config'
import { logger } from '../../logger';

// simple reply function
function replyText(token, texts) {
    logger.debug("token : ",token)
    logger.debug("message: ",texts)
    try {
     //   texts = Array.isArray(texts) ? texts : [texts];
        return this.client.replyMessage(
            token,
            texts.map((text) => ({ type: 'text', text }))
        );
    }
    catch(err){
        logger.error("cann't send reply message", err);
    }

}

async function sendMessage(id, messageContent) { // use for send messages 
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
        logger.debug("Message Content: ", messageContent);
    }
}

async function sendWalkInMessage(activity, userprofile) { // receive information then put its  in createWalkInMessage format and send with sendMessage()
    let message = this.createWalkInMessage(activity, userprofile)
    await this.sendMessage(finalConfig.reportGroupId, message);
}

async function sendConfirmMessage(token) {
    let message = this.confirmMessage();
    await this.replyText(token, message);
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

function createWalkInMessage(activity, userprofile) {//message format

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
                                        "text": "type",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 1
                                    },
                                    {
                                        "type": "text",
                                        "text": "time",
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

    if (activity.type === "out") {
        flexMessage.contents.body.contents[1].contents[0].contents[0].text = "out"
        flexMessage.contents.body.contents[1].contents[0].contents[1].text = moment(activity.clockout).format('MMMM Do YYYY, h:mm:ss a')
    } else if (activity.type === "in") {
        flexMessage.contents.body.contents[1].contents[0].contents[0].text = "in"
        flexMessage.contents.body.contents[1].contents[0].contents[1].text = moment(activity.clockin).format('MMMM Do YYYY, h:mm:ss a')
    }

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
        this.replyText = replyText;
    }
}


export {
    MessageService
};