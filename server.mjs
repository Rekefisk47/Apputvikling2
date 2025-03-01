import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
//Uke 5
import log from './modules/log.mjs';
import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';
//Uke 6
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
//----------------------------------------
server.set('port', port);
server.use(logger);
server.use(express.static('public'));
server.use(express.json());
//Uke 6
server.use("/user", userRouter)
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
