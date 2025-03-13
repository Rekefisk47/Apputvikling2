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
    try{
        res.status(HTTP_CODES.SUCCESS.OK).json(await myHashmap.getAll());
    }catch(error){
        res.status(HTTP_CODES.SUCCESS.OK).json({ status : false, message : "Nothing here yet. soory." });
    }
});

hashmapRouter.post("/", authenticateToken, async (req, res, next) => {
    let value = req.body;
    value["author"] = req.user.username;
    //value["authorId"] = req.user.userId;
    //const workId = createWorkID();

    const work = await myHashmap.set(null, value); //save user work
    
    const author = req.user.username;
    let userWorks = await myUserWorkMap.get(author);
    if(!userWorks){
        let works = [];
        works.push(work.rows[0].id);
        await myUserWorkMap.set(author, works);
    }else{
        let works = userWorks.value;
        works.push(work.rows[0].id);
        await myUserWorkMap.update(author, works);
    }

    res.status(HTTP_CODES.SUCCESS.OK).json({ status: true, message: "You have created a beautiful piece of work!"});
});

hashmapRouter.put("/change/:work_id", (req, res, next) => {
    const value = req.body;
    const key = req.params.work_id;
    myHashmap.update(key, value);
    res.status(HTTP_CODES.SUCCESS.OK).json({ status : true, message : "Your work has updated!" });
});

hashmapRouter.delete("/:work_id", authenticateToken , async (req, res, next) => {
    const key = req.params.work_id;
    
    //delete 
    const response = await myHashmap.remove(key)
    //update user works map
    const userWorks = await myUserWorkMap.get(req.user.username);
    console.log(userWorks, "@@@@@@@@@@@@@");
    if(userWorks){
        /*
        let works = userWorks.value;
        works.push(work.rows[0].id);
        await myUserWorkMap.update(author, works);
        */
        const result = userWorks.value.filter((id) => id != key);
        console.log("API DELETE TEST <----->", result);
        await myUserWorkMap.update(req.user.username, result);
    }
    res.status(HTTP_CODES.SUCCESS.OK).json({ status : true, message : "Hippity hoppity, you have deleted your property!" });
});

export default hashmapRouter;