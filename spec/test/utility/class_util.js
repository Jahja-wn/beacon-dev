(function () {'use strict';}());

function isClass(obj){
    return obj.constructor.name === 'Function';
}

function getClassName(obj){
    if(isClass(obj)) return obj.name;
    else return obj.constructor.name;
}

export{
    isClass,
    getClassName
};