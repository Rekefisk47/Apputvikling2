
import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";
import { validateUsername } from "../modules/validate-username.mjs";
import { passHash, verifyPassHash } from "../modules/password-hash.mjs";
import { generateAndSetCookie, authenticateToken, deleteCookie } from "../modules/token.mjs";

import { userMap } from "../data/service-layer.mjs";

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/create", passHash, validateUsername, async (req, res, next) => {
    
    const username = req.body.username;
    const password = req.body.password;
    const salt = req.body.salt;
    const key = username.toLowerCase();
    
    try {
        const user = await userMap.set(key, { username, password, salt });
        if(user){
            res.status(HTTP_CODES.SUCCESS.OK).json({ message: "User created sucsessfully!", user });
        }else{
            throw new Error("Couldn't create user. Please try another username.");
        }
    } catch (error) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: error.message });
    }
});

userRouter.post("/login", async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const key = username.toLowerCase();

    try {
        const storedUser = await userMap.get(key);
        if(!storedUser){
            throw new Error("No user found. Try again later.");
        }
        const storedHash = storedUser.value.password;
        const storedSalt = storedUser.value.salt;

        const verified = verifyPassHash(password, storedHash, storedSalt);
        if(verified){
            generateAndSetCookie(storedUser, res); //COOKIE TIME
            res.status(HTTP_CODES.SUCCESS.OK).json({ message : "You are now logged in :)", storedUser });
        }else{
            throw new Error("Wrong username or password!");
        }
    } catch (error) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: error.message });
    }
});

userRouter.put("/change", passHash, validateUsername, authenticateToken, async (req, res, next) => {
    const oldUsername = req.user.username.toLowerCase();
    const username = req.body.username;
    const password = req.body.password;
    const salt = req.body.salt;
    const key = username.toLowerCase();
    
    try {
        const newUser = await userMap.update(oldUsername, key, { username, password, salt });
        if(newUser){
            generateAndSetCookie(newUser, res); //NEW COOKIE TIME
            res.status(HTTP_CODES.SUCCESS.OK).json({ message : "You have asucsessfulyl changed your user.", newUser });
        }else{
            throw new Error("Couldn't uodate user. Please try another username.");
        }
    } catch(error) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: error.message });
    }   
});

userRouter.get("/profile", authenticateToken, async (req, res, next) => {
    const loggedInUser = req.user.username; 
    const key = loggedInUser.toLowerCase();

    try{
        const result = await userMap.get(key);
        if(result){
            res.status(HTTP_CODES.SUCCESS.OK).json({ message : "Here is you!", result });
        }else{
            throw new Error("Couldn't find user.");
        }
    }catch(error){ 
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: error.message });
    }
});

userRouter.delete("/delete", authenticateToken, async (req, res, next) => {
    const loggedInUser = req.user.username.toLowerCase();
    try {
        const result = await userMap.remove(loggedInUser);
        if(result){
            deleteCookie(res); //SAD COOKIE TIME
            res.status(HTTP_CODES.SUCCESS.OK).json({ message : "Your user has been sent to the shadow realm!", result });
        }else{
            throw new Error("Couldn't delete user.");
        }
    } catch (error) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: error.message });
    }
});

export default userRouter;

