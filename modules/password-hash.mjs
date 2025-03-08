
//https://dev.to/stephepush/password-security-a-bit-deeper-dive-into-hashes-salts-bcrypt-and-nodes-crypto-module-7l7
import crypto from 'crypto';
/*     
export async function passHash(password) {
    const salt = crypto.randomBytes(32).toString('hex'); 
    //crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return {
        "salt": salt,
        "hash": genHash
    }
}
*/

//Hash the password
export const passHash = (req, res, next) => {

    const salt = crypto.randomBytes(32).toString('hex'); 
    //crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
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





