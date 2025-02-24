import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
//Uke 3
import uke3_Router from './routes/uke3API.mjs';
//Uke 4
import { createDeck } from "./temp/deck.mjs";
import { getDeck } from "./temp/deck.mjs";
import { shuffleDeck } from "./temp/deck.mjs";
import { drawCard } from "./temp/deck.mjs";
import crypto from 'crypto';
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

//---------------------------------------Uke-4---------------------------------------//

let decks = [];
let lastDeckCreated;

server.post("/temp/deck", async (req, res, next) => {
    const uuid = crypto.randomUUID();
    res.status(HTTP_CODES.SUCCESS.OK).send(createDeck(uuid)).end();
    decks.push(createDeck(uuid));
    lastDeckCreated = createDeck(uuid).deck_id;
    console.log(decks);
});

server.get("/temp/deck/get_all", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).send(decks).end();
});

server.delete("/temp/deck/delete_all", (req, res, next) => {
    decks = [];
    res.status(HTTP_CODES.SUCCESS.OK).send({ message: "Deleted all decks succsessfully."}).end();
});

server.patch("/temp/deck/shuffle/:deck_id", (req, res, next) => {
    const deck = getDeck(req.params.deck_id, decks) || getDeck(lastDeckCreated, decks);
    console.log("deck = " + decks.length);
    if(deck != undefined){
        res.status(HTTP_CODES.SUCCESS.OK).send(deck).end();
        shuffleDeck(deck);
    }else{
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("No deck found").end();
    }
});

server.get("/temp/deck/:deck_id", (req, res, next) => {
    const deck = getDeck(req.params.deck_id, decks) || getDeck(lastDeckCreated, decks);
    if(deck != undefined){
        res.status(HTTP_CODES.SUCCESS.OK).send(deck).end();
    }else{
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("No deck found").end();
    }
});

server.get("/temp/deck/:deck_id/card", (req, res, next) => {
    const deck = getDeck(req.params.deck_id, decks) || getDeck(lastDeckCreated, decks);
    if(deck != undefined){
        if(deck.deck.length == 0){
            res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("No more cards left in deck!").end();
        }else{
            res.status(HTTP_CODES.SUCCESS.OK).send(drawCard(deck)).end();
        }
    }else{
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("No deck found").end();
    }
});

//---------------------------------------Uke-4-END-----------------------------------//

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
