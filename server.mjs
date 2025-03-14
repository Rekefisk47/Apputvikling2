
import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import log from './modules/log.mjs';
import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';

import userRouter from './routes/NEW_userAPI.mjs';
import workRouter from './routes/NEW_workAPI.mjs';
import usersWorksRouter from './routes/NEW_userWorkAPI.mjs';

//----------------------------------------//

const ENABLE_LOGGING = false;

const server = express();
const port = (process.env.PORT || 8000);

const logger = log(LOGG_LEVELS.VERBOSE);

//----------------------------------------//

server.set('port', port);

//Middleware setup
server.use(logger);
server.use(express.static('public'));
server.use(express.json());

//API Routers
server.use("/user", userRouter);
server.use("/work", workRouter);
server.use("/user-work", usersWorksRouter);

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
