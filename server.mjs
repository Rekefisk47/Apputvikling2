import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
//Uke 3
import uke3_Router from './routes/uke3API.mjs';
//Uke 4
import deckRouter from './routes/deckAPI.mjs';
//Uke 5
import path from 'path';
import log from './modules/log.mjs';
import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';
import { storeSession, cookies, abTesting } from './modules/session.mjs';
//Uke 6
import { startSession, updateSession } from './modules/session2.mjs';
import treeRouter from './routes/treeAPI.mjs';
import questLogRouter from './routes/questLogAPI.mjs';
import userRouter from './routes/userAPI.mjs';
//Uke 8
import hashmapRouter from './routes/hashmapAPI.mjs';
//----------------------------------------
const ENABLE_LOGGING = false;

const server = express();
const port = (process.env.PORT || 8000);

const logger = log(LOGG_LEVELS.VERBOSE);

//you can turn AB testing on and off
const abTestingOn = abTesting(true); 
//----------------------------------------
server.set('port', port);
server.use(logger);
server.use(startSession);
server.use(express.static('public'));
server.use(express.json());
//Uke 3
server.use("/tmp", uke3_Router);
//Uke 4
server.use("/temp/deck", deckRouter);
//Uke 5
server.use(storeSession);
//Uke 6
server.use("/tree/", treeRouter);
server.use("/quest", questLogRouter);
server.use("/user", userRouter)
server.use(updateSession);
//Uke 8
server.use("/hashmap", hashmapRouter);
//----------------------------------------
 
server.get("/", (req, res, next) => {
    eventLogger("Noen spurte etter root");
    res.status(HTTP_CODES.SUCCESS.OK).send(`Hello World`).end();
});

//---------------------------------------Uke-5---------------------------------------//

//Endpoint for a visual demonstration of the AB test:
server.get("/show_ab_testing", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).sendFile(path.resolve('public', 'abTest.html'));
});

server.get("/get_cookie", (req, res, next) => {
    let decodedCookie = decodeURIComponent(cookies.session); 
    res.send(decodedCookie);
});

//---------------------------------------Uke-5-END-----------------------------------//

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});


export default server;
