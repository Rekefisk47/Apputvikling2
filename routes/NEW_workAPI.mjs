
import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";
import { authenticateToken } from "../modules/token.mjs";

import { workMap } from "../data/service-layer.mjs";

const workRouter = express.Router();
workRouter.use(express.json());


workRouter.post("/post", authenticateToken, async (req, res, next) => {
    const value = req.body; 
    const authorId = req.user.userId;
    value["author"] = req.user.username;

    try {
        const work = await workMap.set(authorId, value );
        if(work){
            res.status(HTTP_CODES.SUCCESS.OK).json({ message: "You have created a beauyiful story!", work });
        }else{
            throw new Error("Couldn't create your work. Please try again later.");
        }
    } catch (error) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: error.message });
    }
});

workRouter.put("/edit/:work_id", authenticateToken, async (req, res, next) => {
    const key = req.params.work_id;
    let value = req.body;
    value["author"] = req.user.username;
    const authorId = req.user.userId;
    
    try {
        const work = await workMap.update(key, authorId,  value );
        if(work){
            res.status(HTTP_CODES.SUCCESS.OK).json({ message: "Hippity hoppity you have edited your property!", work });
        }else{
            throw new Error("Couldn't edit your work. Please try again later.");
        }
    } catch (error) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: error.message });
    }
});

workRouter.get("/get/:work_id", async (req, res, next) => {
    const key = req.params.work_id;
    try {
        const work = await workMap.get(key);
        if(work){
            res.status(HTTP_CODES.SUCCESS.OK).json({ message: "Here you go!", work });
        }else{
            throw new Error("Couldn't find work. Please try again later.");
        }
    } catch (error) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: error.message });
    }
});

workRouter.get("/get-all", async (req, res, next) => {
    try {
        const works = await workMap.getAll();
        if(works){
            res.status(HTTP_CODES.SUCCESS.OK).json({ message: "Here you go!", works });
        }else{
            throw new Error("Couldn't find works. Please try again later.");
        }
    } catch (error) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: error.message });
    }
});

workRouter.delete("/delete/:work_id", async (req, res, next) => {
    const key = req.params.work_id;
    try {
        const work = await workMap.remove(key);
        if(work){
            res.status(HTTP_CODES.SUCCESS.OK).json({ message: "Hippity hoppity you abandoned your property!", work });
        }else{
            throw new Error("Couldn't delete work. Please try again later.");
        }
    } catch (error) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: error.message });
    }
});


export default workRouter;