
async function fetchData(method, url, formDataObj = null){
    let config = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: formDataObj,
    }
    if(formDataObj){
        config.body = JSON.stringify(formDataObj);
    }
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        console.log("Fetch console: ", data);
        return data;
    }catch(error){
        console.log({ message : error + " Something went wrong in fetch"});
    }
}


//-----------------fetch-works---------------//
export async function addWork(formDataObj) {
    return fetchData("POST", "/hashmap", formDataObj);
}

export async function deleteWork(formDataObj) {
    return fetchData("DELETE", `/hashmap/${formDataObj.workId}`);
}

export async function getWork(formDataObj) {
    return fetchData("GET", `/hashmap/${formDataObj.workId}`);
}

export async function getAllWorks() {
    return fetchData("GET", "/hashmap");
}

export async function changeWork(workId, formDataObj) {
    return fetchData("PUT", `/hashmap/change/${workId}`, formDataObj);
}
//-----------------fetch-works---------------//


//-----------------fetch-users---------------//
export async function addUser(formDataObj) {
    return fetchData("POST", "/user/create", formDataObj);
}

export async function loginUser(formDataObj) {
    return fetchData("POST", "/user/login", formDataObj);
}

export async function getUser() {
    return fetchData("GET", "/user/get");
}

export async function getUserProfile() {
    return fetchData("GET", "/user/profile");
}

export async function changeUser(formDataObj) {
    return fetchData("PUT", "/user/change", formDataObj);
}

export async function deleteUser() {
    return fetchData("DELETE", "/user/delete");
}
//-----------------fetch-users---------------//