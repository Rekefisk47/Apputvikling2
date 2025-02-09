import crypto from 'crypto';

let abTestingActive = true; 

export const abTesting = function(status) {
    abTestingActive = status;
    return abTestingActive;
}

export let cookies = {}; 

export function cookieParser(req,res,next) {
    cookies = {};
    const cookieHeader = req.headers.cookie;
    if(cookieHeader){
        const split = cookieHeader.split("=");
        const name = split[0].trim();
        const value = split[1].trim();
        cookies[name] = value;
    }
}
 
function createSession(req,res,next) {
    cookies = {};
    let token = crypto.randomUUID();
    let variant;
    if(abTestingActive){
        variant = getRandomVariant();
    }
    let cookieValue = JSON.stringify({token, variant});
    res.cookie("session", cookieValue, {maxAge: 360*24*60*60*1000, httpOnly: true, secure: true});
    cookies = cookieValue;
}

export function storeSession(req,res,next) {
    if(req.headers.cookie){
        cookieParser(req,res,next);
    }else{
        createSession(req,res,next);
    }
    next();
}

function getRandomVariant(){
    const variants = ["A","B"];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    return randomVariant;
}



