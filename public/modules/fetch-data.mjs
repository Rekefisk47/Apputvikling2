
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

//-----------------fetch-users---------------//
export async function addUser(formData) {
    return fetchData("POST", "/user/create", formData);
}
export async function loginUser(formData) {
    return fetchData("POST", "/user/login", formData);
}
export async function changeUser(formData) {
    return fetchData("PUT", "/user/change", formData);
}
export async function deleteUser() {
    return fetchData("DELETE", "/user/delete");
}
export async function getProfile() {
    return fetchData("GET", "/user/profile");
}
//-----------------fetch-users---------------//


//-----------------fetch-works---------------//
export async function postWork(formData) {
    return fetchData("POST", "/work/post", formData);
}
export async function editWork(work_id, formData) {
    return fetchData("PUT", `/work/edit/${work_id}`, formData);
}
export async function getWork() {
    return fetchData("GET", `/work/get/${work_id}`);
}
export async function getAllWorks() {
    return fetchData("GET", `/work/get-all`);
}
export async function deleteWork(work_id) {
    return fetchData("DELETE", `/work/delete/${work_id}`);
}
//-----------------fetch-works---------------//


//-----------------fetch-user-works---------------//
export async function getAllUsersWorks(user_id) {
    return fetchData(`GET`, `/user-work/get-works/${user_id}`);
}
//-----------------fetch-user-works---------------//
