import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";
import path from 'path';
import { cookies } from '../modules/session.mjs';

const abTestRouter = express.Router();

//---------------------------------------Uke-5---------------------------------------//

//Endpoint for a visual demonstration of the AB test:
abTestRouter.get("/show_ab_testing", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).sendFile(path.resolve('public', 'abTest.html'));
});

abTestRouter.get("/get_cookie", (req, res, next) => {
    let decodedCookie = decodeURIComponent(cookies.session); 
    res.send(decodedCookie);
});

//---------------------------------------Uke-5-END-----------------------------------//

export default abTestRouter;