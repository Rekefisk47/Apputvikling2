import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import poem from "./tmp/poem.mjs";
import { randomQuote } from "./tmp/quote.mjs";
import { calculateSum } from './tmp/sum.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}

server.get("/", getRoot);

function getPoem(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
}

server.get("/tmp/poem", getPoem);

function getQuote(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote()).end();
}

server.get("/tmp/quote", getQuote);

function getSum(req, res, next) {
    const a = req.params.a;
    const b = req.params.b;
    const sum = calculateSum(a,b);
    res.status(HTTP_CODES.SUCCESS.OK).send({ sum }).end();
};

server.post("/tmp/sum/:a/:b", getSum);

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});