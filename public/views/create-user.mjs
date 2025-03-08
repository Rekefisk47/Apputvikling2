import { placeTemplate } from "../modules/load-templates.mjs";
import { formDataToObject } from "../modules/formData-to-object.mjs";
import { addUser } from "../modules/fetch-data.mjs";
import { messagehandler } from "../modules/message-handler.mjs";

export function init(pageData = null) {
    console.log("Create user script loaded");

    document.getElementById("login-user-link").addEventListener("click", () => {
        placeTemplate("login-user-template.html", "login-user.mjs");
    });

    const createUserForm = document.getElementById("create-user-form");
    
    createUserForm.addEventListener("submit", async evt => {
        evt.preventDefault();

        const formData = new FormData(createUserForm);
        const formDataObj = formDataToObject(formData);
        
        //fetch response 
        let response =  await addUser(formDataObj);
        if(response.status){
            messagehandler(response.message);
            placeTemplate("login-user-template.html", "login-user.mjs");
        }else{
            messagehandler(response.message);
        }
    });
}