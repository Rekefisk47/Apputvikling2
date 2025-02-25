import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
//Uke 3
import uke3_Router from './routes/uke3API.mjs';
//Uke 4
import deckRouter from './routes/deckAPI.mjs';
//Uke 5
import log from './modules/log.mjs';
import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';
import { storeSession, abTesting } from './modules/session.mjs';
import abTestRouter from './routes/abTestAPI.mjs';
//Uke 6
import { startSession, updateSession } from './modules/session2.mjs';
import treeRouter from './routes/treeAPI.mjs';
import questLogRouter from './routes/questLogAPI.mjs';
import userRouter from './routes/userAPI.mjs';
//Uke 8
import hashmapRouter from './routes/hashmapAPI.mjs';
//uke 9
import path from 'path';
//----------------------------------------
const ENABLE_LOGGING = false;

const server = express();
const port = (process.env.PORT || 8000);

const logger = log(LOGG_LEVELS.VERBOSE);

//you can turn AB testing on and off 
//NB!(does not affect users that already has a variant)
const abTestingOn = abTesting(true); 
//----------------------------------------
server.set('port', port);
server.use(logger);
server.use(startSession);//<-christian sin session
server.use(storeSession);//<- min session
server.use(express.static('public'));
server.use(express.json());
//Uke 3
server.use("/tmp", uke3_Router);
//Uke 4
server.use("/temp/deck", deckRouter);
//Uke 5
server.use("/", abTestRouter);
//Uke 6
server.use("/tree/", treeRouter);
server.use("/quest", questLogRouter);
server.use("/user", userRouter)
server.use(updateSession);
//Uke 8
server.use("/hashmap", hashmapRouter);
//----------------------------------------//
 
server.get("/", (req, res, next) => {
    eventLogger("Noen spurte etter root");
    res.status(HTTP_CODES.SUCCESS.OK).send(`Hello World`).end();
});

//----------------------------------------//

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});


export default server;
