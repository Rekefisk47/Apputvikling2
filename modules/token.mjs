import crypto from 'crypto';
import HTTP_CODES from '../utils/httpCodes.mjs';

//middleware for creating and validating tokens

const secretKey = process.env.SECRET_KEY;

//------------------------------------//
//SETS A COOKIE
function generateToken(user) {
    // Payload contains the user information
    const payload = JSON.stringify({
        userId: user.userId,
        username: user.username,
        expirationDate: Date.now() + 24 * 60 * 60 * 1000,
    });

    const base64Payload = Buffer.from(payload).toString('base64');
    const base64UrlPayload = base64Payload.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const signature = crypto.createHmac('sha256', secretKey).update(base64UrlPayload).digest('base64');
    const base64UrlSignature = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const token = `${base64UrlPayload}.${base64UrlSignature}`;

    return token;
}

export function generateAndSetCookie(user, res){
    const token = generateToken(user);
    setCookie(token, res);
}

function setCookie(token, res){                           //Set false bc production in http
    res.cookie("session", token, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: false});
}

export function deleteCookie(res){
    res.cookie("session", "", {maxAge: 0, httpOnly: true, secure: false});
}
//------------------------------------//

//------------------------------------//
//CHECKS AND VALIDATES COOKIE 
async function cookieParser(req,res,next){
    let cookies = {};
    const cookieHeader = req.headers.cookie;
    if(cookieHeader){
        const split = cookieHeader.split("=");
        const name = split[0].trim();
        const value = split[1].trim();
        cookies[name] = value;
    }
    const token  = cookies.session;
    return token;
}

export async function authenticateToken(req, res, next){
    const token = await cookieParser(req,res,next);
    
    if(!token){
        res.status(HTTP_CODES.CLIENT_ERROR.UNAUTHORIZED).json({ status: false, message: "You are not logged in!"});
        return;
    }

    const splitToken = token.split('.');
    const base64UrlPayload = splitToken[0];
    const base64UrlSignature = splitToken[1];

    const base64Payload = base64UrlPayload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
        
    //checks if token expired
    if (decodedPayload.expirationDate < Date.now()) {
        res.status(HTTP_CODES.CLIENT_ERROR.UNAUTHORIZED).json({ message: "Token has expired!"});
        return;
    }

    //checks signature
    const signature = crypto.createHmac('sha256', secretKey).update(base64Payload).digest('base64');
    const webFriendlySignature = base64UrlSignature.replace(/-/g, '+').replace(/_/g, '/');
    const signatureWithoutPadding = signature.replace(/=+$/, '');//removes the = at the end

    if (signatureWithoutPadding !== webFriendlySignature) {
        res.status(HTTP_CODES.CLIENT_ERROR.UNAUTHORIZED).json({ message: "Invalid token!"});
        return;
    }
      
    req.user = decodedPayload;

    next();
}
//------------------------------------//


//takes information and makes a base64 string
//sign the information with a secretkey
//makes the strings url friendly
//adds base64 string and signature them to a token


//gets the token 
//splits url fridly base 64 and signature
//removes the url fridly part
//decod payload back to user information
//creature signature for the decoded payload
//checks if signature is the same as the one sents