
import { formDataToObject } from "./formData-to-object.mjs";

const workForm = document.getElementById("work-form");
const tools = document.getElementById("tools");
const iframe = document.getElementById("content");

const deleteWorkForm = document.getElementById("delete-work-form");
const getWorkForm = document.getElementById("get-work-form");
const changeWorkForm = document.getElementById("change-work-form");

function appendGenre(formData){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        if(checkbox.checked === true){
            formData.append("genre", checkbox.value);
        }
    });
    return formData;
}

//---------------iframe----------------//
const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

iframeDoc.open();
iframeDoc.write('<!DOCTYPE html><html><body contenteditable="true"></body></html>');
iframeDoc.close();

function formatText(tag) {
    iframe.contentWindow.document.execCommand(tag, false, null);
}

tools.addEventListener("click", async evt => {
    evt.preventDefault();
    const isButton = evt.target.nodeName === 'BUTTON';
    if(!isButton){
        return;
    }
    if(evt.target.id == "Bold"){
        formatText('bold');
    }else if(evt.target.id == "Italic"){
        formatText('italic');
    }
});

//keyboard shortcuts 
iframeDoc.addEventListener('keydown', function(evt) {
    if ((evt.metaKey || evt.ctrlKey) && evt.key === 'b') {
        evt.preventDefault();
        formatText('bold');
    }else if((evt.metaKey || evt.ctrlKey) && evt.key === 'i') {
        evt.preventDefault();
        formatText('italic');
    }
});
//---------------iframe----------------//

//---------------Add work--------------//
//submit work formdata
workForm.addEventListener("submit", async evt => {
    evt.preventDefault();
    const formData = new FormData(workForm);

    const iframe = document.getElementById('content');
    const content = iframe.contentDocument.body.innerHTML;

    formData.append('content', content); 
    appendGenre(formData);  
                
    const formDataObj = formDataToObject(formData);
    addWork(formDataObj);
});

//---------------Delete work--------------//
deleteWorkForm.addEventListener("submit", async evt => {
    evt.preventDefault();
    const formData = new FormData(deleteWorkForm);
    const formDataObj = formDataToObject(formData);
    deleteWork(formDataObj); 
}); 

//---------------Get work--------------//
getWorkForm.addEventListener("submit", async evt => {
    evt.preventDefault();
    let formData = new FormData(getWorkForm);
    const formDataObj = formDataToObject(formData);
    const workData = await getWork(formDataObj); 
    if (workData) {
        addToForm(changeWorkForm, workData);
    }
});

function addToForm(form, data) {
    console.log(form);console.log(data);console.log(data.key, data.value);
    uncheckAllBoxes(form); 
    
    for(let value in data.value){
        console.log("value");
        console.log(data.value[value]);

        const input = form.querySelector(`[name="${value}"]`);
        
        //if normal fields
        if(input){
            input.value = data.value[value]; 
        }

        //if checkbox field
        if(input.type === "checkbox"){       
            //for every obj in array, check the box and 
            data.value[value].forEach((value) => { 
                console.log("GENRE: ", value);

                //only get boxes with same value
                const checkbox = form.querySelector(`[value="${value}"]`);

                if(checkbox){
                    checkbox.checked = true;
                }
            });
        }

        //if iframe field

    }
}

function uncheckAllBoxes(form){
    const checkboxes = form.querySelectorAll(`input[type="checkbox"]`);
    checkboxes.forEach((checkbox) => { 
        checkbox.checked = false;
    });
}

//---------------Change work--------------//
changeWorkForm.addEventListener("submit", async evt => {
    evt.preventDefault();
    let formData = new FormData(changeWorkForm);
    const formDataObj = formDataToObject(formData);
    changeWork(formDataObj); 
});



//----------------------------------------------------------//
//-------------------------FETCH----------------------------//
//----------------------------------------------------------//
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

//-----------------fetch works---------------//
async function addWork(formDataObj) {
    return fetchData("POST", "/hashmap", formDataObj);
}

async function deleteWork(formDataObj) {
    return fetchData("DELETE", `/hashmap/${formDataObj.workId}`);
}

async function getWork(formDataObj) {
    return fetchData("GET", `/hashmap/${formDataObj.workId}`);
}

async function changeWork(formDataObj) {
    return fetchData("PUT", `/hashmap/${formDataObj.workId}`, formDataObj);
}