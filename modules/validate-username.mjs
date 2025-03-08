import HTTP_CODES from "../utils/httpCodes.mjs";

//middleware for validating username
export const validateUsername = (req, res, next) => {
    const username = req.body.username;
    const usernameRegex = /^[a-zA-Z0-9]{1,20}$/; 

    if (!usernameRegex.test(username)) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({message: "Invalid username. Try another one."}).end();
    }

    next();
};

