import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";
import crypto from 'crypto';
import { createDeck } from "../temp/deck.mjs";
import { getDeck } from "../temp/deck.mjs";
import { shuffleDeck } from "../temp/deck.mjs";
import { drawCard } from "../temp/deck.mjs";

const deckRouter = express.Router();

//---------------------------------------Uke-4---------------------------------------//

let decks = [];
let lastDeckCreated;

deckRouter.post("/", async (req, res, next) => {
    const uuid = crypto.randomUUID();
    res.status(HTTP_CODES.SUCCESS.OK).send(createDeck(uuid)).end();
    decks.push(createDeck(uuid));
    lastDeckCreated = createDeck(uuid).deck_id;
    console.log(decks);
});

deckRouter.get("/get_all", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).send(decks).end();
});

deckRouter.delete("/delete_all", (req, res, next) => {
    decks = [];
    res.status(HTTP_CODES.SUCCESS.OK).send({ message: "Deleted all decks succsessfully."}).end();
});

deckRouter.patch("/shuffle/:deck_id", (req, res, next) => {
    const deck = getDeck(req.params.deck_id, decks) || getDeck(lastDeckCreated, decks);
    console.log("deck = " + decks.length);
    if(deck != undefined){
        res.status(HTTP_CODES.SUCCESS.OK).send(deck).end();
        shuffleDeck(deck);
    }else{
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("No deck found").end();
    }
});

deckRouter.get("/:deck_id", (req, res, next) => {
    const deck = getDeck(req.params.deck_id, decks) || getDeck(lastDeckCreated, decks);
    if(deck != undefined){
        res.status(HTTP_CODES.SUCCESS.OK).send(deck).end();
    }else{
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("No deck found").end();
    }
});

deckRouter.get("/:deck_id/card", (req, res, next) => {
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

export default deckRouter;