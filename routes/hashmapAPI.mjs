import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";
import { hashMap } from "../data/hashmap.mjs";
import { createWorkID } from "../modules/work-id-generator.mjs";
const hashmapRouter = express.Router();
import { authenticateToken } from "../modules/token.mjs";

import { userWorkMap } from "../data/hashmap.mjs";
let myUserWorkMap = userWorkMap;

const myHashmap = hashMap;

hashmapRouter.use(express.json());

hashmapRouter.get("/:id", (req, res, next) => {
    const key = req.params.id;
    res.json(myHashmap.get(key));
});

hashmapRouter.get("/", async (req, res, next)  => {
    res.status(HTTP_CODES.SUCCESS.OK).json(myHashmap.getAll());
});

hashmapRouter.post("/", authenticateToken, (req, res, next) => {
    let value = req.body;
    value["author"] = req.user.username;
    value["authorId"] = req.user.userId;
    const workId = createWorkID();     

    const author = req.user.username;
    //Stores all users works in its own map
    let userWorks = myUserWorkMap.get(author);
    if(!userWorks){
        let works = [];
        works.push(workId);
        myUserWorkMap.set(author, works);
    }else{
        let test = userWorks.value;
        test.push(workId);
        myUserWorkMap.update(author, test);
    }
    
    myHashmap.set(workId, value); //workId, work info
    res.status(HTTP_CODES.SUCCESS.OK).json({ status: true, message: "You have created a beautiful piece of work!"});
});

hashmapRouter.put("/change/:work_id", (req, res, next) => {
    const value = req.body;
    const key = req.params.work_id;
    myHashmap.update(key, value);
    res.status(HTTP_CODES.SUCCESS.OK).json({ status : true, message : "Your work has updated!" });
});

hashmapRouter.delete("/:work_id", (req, res, next) => {
    const key = "work" + req.params.work_id;
    res.status(HTTP_CODES.SUCCESS.OK).json(myHashmap.remove(key));
});

export default hashmapRouter;