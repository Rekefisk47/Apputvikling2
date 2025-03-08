import express from "express";
import { userMap } from "../data/hashmap.mjs";
import HTTP_CODES from "../utils/httpCodes.mjs";
import { validateUsername } from "../modules/validate-username.mjs";
import { passHash, verifyPassHash } from "../modules/password-hash.mjs";
import { generateAndSetCookie } from "../modules/token.mjs";

const userRouter = express.Router();

userRouter.use(express.json());

const myUserMap = userMap;

userRouter.get("/get", (req, res, next) => {
    const value = req.body.username; 
    const key = value.toLowerCase();
    
    try{
        res.status(HTTP_CODES.SUCCESS.OK).send(myUserMap.get(key)).end();
    }catch(error){
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({message: "No match found."});
    }
});

userRouter.post("/create", passHash, validateUsername, (req, res, next) => {
    const value = req.body;
    const key = value.username.toLowerCase();

    //validate username
    if(!req.body.username){
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ status: false, message: 'Valid username is required' });
    }
    //if username already exists
    if(myUserMap.get(key)){
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ status: false, message: 'Username already exists' });
    }else{
        //add user to datastructure
        myUserMap.set(key, value)
        res.status(HTTP_CODES.SUCCESS.OK).json({ status: true, message : "User sucsessfully created!"}).end();
    }
});

userRouter.post("/login", (req, res, next) => {
    const value = req.body;
    const key = value.username.toLowerCase();

    try{
        //gets and checks for mathing hash
        const storedUser = userMap.get(key);
        const storedHash = storedUser.value.password;
        const storedSalt = storedUser.value.salt;

        const verified = verifyPassHash(value.password, storedHash, storedSalt);
        
        if(verified){
            //COOKIE 
            generateAndSetCookie(storedUser.value, res);

            res.status(HTTP_CODES.SUCCESS.OK).json({ status: true, message : "You are now logged in :)"}).end();
        }else{
            res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ status: false,  message : "Wrong username or password :("}).end();
        }
    }catch(error){
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ status: false,  message : "Couldn't find a username that matched."}).end();
    }
});

userRouter.put("/change", validateUsername, (req, res, next) => {
    const value = req.body;
    const key = value.username.toLowerCase();
    
    res.status(HTTP_CODES.SUCCESS.OK).json({ status: true,  message : "User changed"}).end();
});

userRouter.delete("/delete", (req, res, next) => {
    //res.status(HTTP_CODES.SUCCESS.OK).json({ message : "User deleted"}).end();
});

export default userRouter