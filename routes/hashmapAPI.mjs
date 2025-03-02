import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";
import { hashMap } from "../data/hashmap.mjs";
import createWorkID from "../modules/work-id-generator.mjs";
const hashmapRouter = express.Router();

const myHashmap = hashMap;

hashmapRouter.use(express.json());

hashmapRouter.get("/:work_id", (req, res, next) => {
    const key = "work" + req.params.work_id;
    res.json(myHashmap.get(key));
});

hashmapRouter.post("/", (req, res, next) => {
    console.log("------");
    console.log(req.body);
    console.log("------");

    const bodyData = req.body;
    const value = bodyData;

    const work_id = createWorkID(); //creates a new work with an interger ID
    const key = "work" + work_id;
    
    res.status(HTTP_CODES.SUCCESS.OK).json(myHashmap.set(key, value)).end();
});

hashmapRouter.put("/:work_id", (req, res, next) => {
    const bodyData = req.body;
    const value = bodyData;

    const key = "work" + req.params.work_id;

    res.status(HTTP_CODES.SUCCESS.OK).json(myHashmap.update(key, value)).end();
});

hashmapRouter.delete("/:work_id", (req, res, next) => {
    const key = "work" + req.params.work_id;
    res.status(HTTP_CODES.SUCCESS.OK).json(myHashmap.remove(key)).end();
});

export default hashmapRouter;