
import crypto from 'crypto';

export const passHash = (req, res, next) => {

    const salt = crypto.randomBytes(32).toString('hex'); 

    const genHash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64, 'sha512').toString('hex');

    req.body.password = genHash;
    req.body["salt"] = salt;
    console.log("in middleware: ", req.body);

    next();
};

//Verify password 
export function verifyPassHash(pass, storedHash, storedSalt) {
    const newHash = crypto.pbkdf2Sync(pass, storedSalt, 10000, 64, 'sha512').toString('hex');
    if(newHash === storedHash){
        return true;
    }
}





