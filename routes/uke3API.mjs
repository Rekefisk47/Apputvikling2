import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";
import poem from "../tmp/poem.mjs";
import { randomQuote } from "../tmp/quote.mjs";
import { calculateSum } from "../tmp/sum.mjs";

const uke3_Router = express.Router();

uke3_Router.use(express.json());

uke3_Router.get("/poem", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
});

uke3_Router.get("/quote", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote()).end();
});

uke3_Router.get("/sum/:a/:b", (req, res, next) => {
    const a = req.params.a;
    const b = req.params.b;
    const sum = calculateSum(a,b);
    if(sum){
        res.status(HTTP_CODES.SUCCESS.OK).send({ sum }).end();
    }else{
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("Not a number").end();
    }
});

export default uke3_Router;