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

userRouter.get("/get", async (req, res, next) => {
    const value = req.body.username; 
    const key = value.toLowerCase();
    
    try{
        res.status(HTTP_CODES.SUCCESS.OK).send(await myUserMap.get(key)).end();
    }catch(error){
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({message: "No match found."});
    }
});

userRouter.get("/profile", authenticateToken, async (req, res, next) => {
    const loggedInUser = req.user.username; 
    const key = loggedInUser.toLowerCase();
    try{
        const worksArray = await myUserWorkMap.get(key);
        let works = [];
        if(worksArray){
            for (let i = 0; i < worksArray.value.length; i++) {
                let work = await myHashmap.get(worksArray.value[i]);
                works.push(work);
            }
        }
        res.status(HTTP_CODES.SUCCESS.OK).json({ status: true, message: "Here is your user!", user :  await userMap.get(key), works: works });
    }catch(error){ 
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ status: false, message: "Hippity hoppity this is not your property!"});
    }
});

userRouter.post("/create", passHash, validateUsername, async (req, res, next) => {
    const value = req.body;
    const key = value.username.toLowerCase();
  
    //validate username
    if(!req.body.username){
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ status: false, message: 'Valid username is required' });
    }
    //if username already exists
    if(await myUserMap.get(key)){
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ status: false, message: 'Username already exists' });
    }else{
        /*
        //create a user ID //REMOVE LATER
        value["userId"] = createUserID();
        */
        //add user to datastructure
        await myUserMap.set(key, value);
        
        res.status(HTTP_CODES.SUCCESS.OK).json({ status: true, message : "User sucsessfully created!"});
    }
});

userRouter.post("/login", async (req, res, next) => {
    const value = req.body;
    const key = value.username.toLowerCase();

    try{
        //gets and checks for mathing hash
        const storedUser = await userMap.get(key);
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

userRouter.put("/change", passHash, validateUsername, authenticateToken, async (req, res, next) => {
    const value = req.body;
    const newUsername = value.username.toLowerCase();
    const oldUsername = req.user.username;

    //check if username already exists
    if(await myUserMap.get(newUsername)){
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ status: false, message: 'Username already exists' });
    }
    
    //update usename (key) 
    await myUserMap.updateKey(oldUsername, newUsername);

    //updates usermap with connected work (key) 
    await userWorkMap.updateKey(oldUsername, newUsername);
      
    //update password (value)
    //value["userId"] = req.user.userId;
    await myUserMap.update(newUsername, value);

    //Change the username on all their works  (if they have any) 
    const work_ids = await userWorkMap.get(newUsername);
    console.log(work_ids, "^^^^^^^^^^^^^");
    if(work_ids){
        for (let i = 0; i < work_ids.value.length; i++) {
            let work = await myHashmap.get(work_ids.value[i]);
            work.value.author = newUsername;
            await myHashmap.update(work.key, work.value);
        }
    }
    
    //COOKIE 
    const storedUser = await userMap.get(newUsername);
    console.log("^^^COOKIE:^^^");
    console.log(storedUser);
    console.log("^^^COOKIE:^^^");
    generateAndSetCookie(storedUser.value, res);

    res.status(HTTP_CODES.SUCCESS.OK).json({ status: true,  message : "Username and password sucsessfully changed!"});
});

userRouter.delete("/delete", authenticateToken, async (req, res, next) => {
    const username = req.user.username;
    //remove user
    await myUserMap.remove(username);
    //remove works
    const work_ids = await userWorkMap.get(username);
    if(work_ids){
        for (let i = 0; i < work_ids.value.length; i++) {
            console.log(work_ids.value[i], "æææææ");
            myHashmap.remove(work_ids.value[i]);
        }
    }
    //remove users work array
    await myUserWorkMap.remove(username);
    //remove cookie
    deleteCookie(res);
    res.status(HTTP_CODES.SUCCESS.OK).json({status: true, message : "Your use has been sent to the Shadow Realm!"}).end();
});

export default userRouter