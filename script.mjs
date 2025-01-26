import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import poem from "./tmp/poem.mjs";
import { randomQuote } from "./tmp/quote.mjs";
import { calculateSum } from './tmp/sum.mjs';
import { createDeck } from "./temp/deck.mjs";
import { getDeck } from "./temp/deck.mjs";
import { shuffleDeck } from "./temp/deck.mjs";
import { drawCard } from "./temp/deck.mjs";

import crypto from 'crypto';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));
server.use(express.json());

const decks = [];
let lastDeckCreated;

server.get("/", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
});

//Uke 3
server.get("/tmp/poem", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
});

server.get("/tmp/quote", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote()).end();
});

server.post("/tmp/sum/:a/:b", (req, res, next) => {
    const a = req.params.a;
    const b = req.params.b;
    const sum = calculateSum(a,b);
    res.status(HTTP_CODES.SUCCESS.OK).send({ sum }).end();
});
//Uke 3-END

//Uke 4
server.post("/temp/deck", async (req, res, next) => {
    const uuid = crypto.randomUUID();
    res.status(HTTP_CODES.SUCCESS.OK).send(createDeck(uuid)).end();
    decks.push(createDeck(uuid));
    lastDeckCreated = createDeck(uuid).deck_id;
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
//Uke 4-END

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});