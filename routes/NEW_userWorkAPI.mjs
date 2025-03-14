
import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";
import { authenticateToken } from "../modules/token.mjs";

import { userWorkMap } from "../data/service-layer.mjs";

const usersWorksRouter = express.Router();
usersWorksRouter.use(express.json());



usersWorksRouter.get("/get-works/:user_id", authenticateToken, async (req, res, next) => {
    const key = req.params.user_id;
    console.log(req.user);

    try {
        const works = await userWorkMap.get(key);
        if(works){
            res.status(HTTP_CODES.SUCCESS.OK).json({ message : "Here are your stories!", works });
        }else{
            throw new Error("Couldn't find works.");
        }
    } catch (error) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: error.message });
    }

});


export default usersWorksRouter;