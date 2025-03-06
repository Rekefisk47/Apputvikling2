
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
        console.log(data);
        return data;
    }catch(error){
        console.log(error, 'Something went wrong in fetch');
    }
}

//-----------------fetch-works---------------//
export async function addWork(formDataObj) {
    return fetchData("POST", "/hashmap", formDataObj);
}

async function deleteWork(formDataObj) {
    return fetchData("DELETE", `/hashmap/${formDataObj.workId}`);
}

async function getWork(formDataObj) {
    return fetchData("GET", `/hashmap/${formDataObj.workId}`);
}

async function changeWork(workId, formDataObj) {
    console.log("@@@", workId.workId);
    console.log(formDataObj);
    return fetchData("PUT", `/hashmap/${workId.workId}`, formDataObj);
}
//-----------------fetch-works---------------//


//-----------------fetch-users---------------//

//-----------------fetch-users---------------//