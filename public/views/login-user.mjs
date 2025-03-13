import { placeTemplate } from "../modules/load-templates.mjs";
import { formDataToObject } from "../modules/formData-to-object.mjs";
import { loginUser } from "../modules/fetch-data.mjs";
import { messagehandler } from "../modules/message-handler.mjs";

export function init(pageData = null) {

    document.getElementById("create-user-link").addEventListener("click", () => {
        placeTemplate("create-user-template.html", "create-user.mjs");
    });

    const loginUserForm = document.getElementById("login-user-form");
    
    loginUserForm.addEventListener("submit", async evt => {
        evt.preventDefault();
        const formData = new FormData(loginUserForm);
        const formDataObj = formDataToObject(formData);

        //fetch response 
        document.getElementById("loading").showModal();
        let response =  await loginUser(formDataObj);
        document.getElementById("loading").close();

        if(response.status){
            messagehandler(response.message);
            placeTemplate("home-template.html", "home.mjs");
        }else{
            messagehandler(response.message);
        }
    });
}