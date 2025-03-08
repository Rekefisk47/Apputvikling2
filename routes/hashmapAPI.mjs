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
    console.log("^^^^", req.user);
    const author = req.user.username;
    value["author"] = req.user.username;
    value["authorId"] = req.user.userId;
    const workId = createWorkID(); 
    myHashmap.set(workId, value);//workId, work info
    

    //Stores all users works in its own map
    let userWorks = myUserWorkMap.get(author);
    console.log("$$$", userWorks);
    if(!userWorks){
        let works = [];
        works.push(workId);
        myUserWorkMap.set(author, works);
    }else{
        let test = userWorks.value;
        test.push(workId);
        console.log("###", test);
        myUserWorkMap.update(author, test);
    }

    console.log("--------------");
    //console.log(value);
    console.log("--------------");
    console.log("Authenticated user:", req.user.username);
    console.log("--------------");
    /*
    //add to map for easy lookup
    if (!myUserWorkMap[author.toLowerCase()]) {
        myUserWorkMap[author.toLowerCase()] = [];
    }
    myUserWorkMap[author.toLowerCase()].push(key, value); 
    console.log(myUserWorkMap);
    */
   
    //myUserWorkMap.set(author, key);
    //---------------------------//
    
    res.status(HTTP_CODES.SUCCESS.OK).json({ status: true, message: "You have created a beautiful piece of work!"});
});

hashmapRouter.put("/:work_id", (req, res, next) => {
    const bodyData = req.body;
    const value = bodyData;

    const key = "work" + req.params.work_id;

    res.status(HTTP_CODES.SUCCESS.OK).json(myHashmap.update(key, value)).end();
});

hashmapRouter.delete("/:work_id", (req, res, next) => {
    const key = "work" + req.params.work_id;
    res.status(HTTP_CODES.SUCCESS.OK).json(myHashmap.remove(key));
});

export default hashmapRouter;