import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";
import { hashMap, userMap, userWorkMap} from "../data/hashmap.mjs";
import { validateUsername } from "../modules/validate-username.mjs";
import { passHash, verifyPassHash } from "../modules/password-hash.mjs";
import { authenticateToken, generateAndSetCookie, deleteCookie } from "../modules/token.mjs";
import { createUserID } from "../modules/work-id-generator.mjs";

const userRouter = express.Router();

userRouter.use(express.json());

const myUserMap = userMap;
const myUserWorkMap = userWorkMap;
const myHashmap = hashMap;

userRouter.get("/get", (req, res, next) => {
    const value = req.body.username; 
    const key = value.toLowerCase();
    
    try{
        res.status(HTTP_CODES.SUCCESS.OK).send(myUserMap.get(key)).end();
    }catch(error){
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({message: "No match found."});
    }
});

userRouter.get("/profile", authenticateToken, (req, res, next) => {
    const loggedInUser = req.user.username; 
    const key = loggedInUser.toLowerCase();
    
    const worksArray = myUserWorkMap.get(key);
    let works = [];
    if(worksArray){
        worksArray.value.forEach(workId => {
            works.push(myHashmap.get(workId));
        });
    }

    try{
        res.status(HTTP_CODES.SUCCESS.OK).json({ status: true, message: "Here is your user!", user :  userMap.get(key), works: works });
    }catch(error){ 
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ status: false, message: "Couldn't find your profile?."});
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
        //create a user ID
        value["userId"] = createUserID();
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

userRouter.put("/change", passHash, validateUsername, authenticateToken, (req, res, next) => {
    const value = req.body;
    const newUsername = value.username.toLowerCase();
    const oldUsername = req.user.username;

    //update usename (key) 
    myUserMap.updateKey(oldUsername, newUsername);

    //updates usermap with connected work (key) 
    userWorkMap.updateKey(oldUsername, newUsername);

    //update password (value)
    value["userId"] = req.user.userId;
    myUserMap.update(newUsername, value);

    //Change the username on all their works  (if they have any) 
    const work_ids = userWorkMap.get(newUsername);
    if(work_ids){
        for (let i = 0; i < work_ids.value.length; i++) {
            let work = myHashmap.get(work_ids.value[i]);
            work.value.author = newUsername;
            myHashmap.update(work.key, work.value);
        }
    }

    //COOKIE 
    const storedUser = userMap.get(newUsername);
    generateAndSetCookie(storedUser.value, res);

    res.status(HTTP_CODES.SUCCESS.OK).json({ status: true,  message : "Username and password sucsessfully changed!"});
});

userRouter.delete("/delete", authenticateToken, (req, res, next) => {
    const username = req.user.username;
    //remove user
    myUserMap.remove(username);
    //remove works
    const work_ids = userWorkMap.get(username);
    if(work_ids){
        for (let i = 0; i < work_ids.value.length; i++) {
            console.log(work_ids.value[i], "æææææ");
            myHashmap.remove(work_ids.value[i]);
        }
    }
    //remove users work array
    myUserWorkMap.remove(username);
    //remove cookie
    deleteCookie(res);
    res.status(HTTP_CODES.SUCCESS.OK).json({status: true, message : "Your use has been sent to the Shadow Realm!"}).end();
});

export default userRouter