
let workCounter = 0;
export function createWorkID(){
    workCounter ++;
    return (workCounter);
}

let userCounter = 0;
export function createUserID(){
    userCounter ++;
    return (userCounter);
}