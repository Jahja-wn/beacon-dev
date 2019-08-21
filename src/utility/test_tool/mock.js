(function () {'use strict';}());

import { Client } from "@line/bot-sdk";
import config from '../../core/config';
import { MessageService } from "../../core/service";

function mockDelaySendMessage(listMessage){
    return (id, message) => {return new Promise((resolve,reject) =>{setTimeout(()=>{
        listMessage.push({toId: id,message: message}); 
        resolve();
    },1000);});};   
}

function mockDelayGetProfile(profile){
    return ()=>{return new Promise((resolve,reject)=>{setTimeout(()=>{resolve(profile);},1000);});};
}

function mockLineClient(listMessage,profile){
    let lineClient = new Client(config);
    if(listMessage !== null) {
        lineClient.pushMessage = mockDelaySendMessage(listMessage);
    }
    if(profile !== null){
        lineClient.getProfile = mockDelayGetProfile(profile);
    }
    return lineClient;
}


function mockMessageService(listMessage){
    return new MessageService(mockLineClient(listMessage));
}

export{
    mockDelaySendMessage,
    mockDelayGetProfile,
    mockLineClient,
    mockMessageService
};