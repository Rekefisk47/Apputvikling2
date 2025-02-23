import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";
import { myMap } from "../data/hashmap.mjs";
const hashmapRouter = express.Router();

const myHashmap = myMap;

hashmapRouter.use(express.json());
//get all
hashmapRouter.get("/items", (req, res, next) => {
    res.send(myHashmap.getAllItems());
});
//get specific 
hashmapRouter.get("/item/", (req, res, next) => {
    const key = req.query.key;
    console.log(req.query.key);
    res.json({ "key" : key, "value" : myHashmap.getItem(key)});
});

hashmapRouter.post("/", (req, res, next) => {
    const { key, value } = req.query;
    myHashmap.setItem(key, value);
    res.json({ key, value });
});

hashmapRouter.put("/", (req, res, next) => {
    res.status(HTTP_CODES.SERVER_ERROR.NOT_IMPLEMENTED).send("Nothing here yet...").end();
});

hashmapRouter.delete("/", (req, res, next) => {
    const key = req.query.key;
    myHashmap.removeItem(key);
    res.send("Deleted: " + key);
});

export default hashmapRouter;