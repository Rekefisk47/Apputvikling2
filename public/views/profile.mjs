import { formDataToObject } from "../modules/formData-to-object.mjs";
import { placeTemplate } from "../modules/load-templates.mjs";
import { messagehandler } from "../modules/message-handler.mjs";
import { changeUser, deleteUser, getUserProfile } from "../modules/fetch-data.mjs";

export async function init(pageData = null){

    let username = document.getElementById("username");
    let userId = document.getElementById("userId");
    username.innerHTML =  pageData.user.value.username;
    userId.innerHTML = "My user id is: " + pageData.user.value.userId;

    document.getElementById("changeBtn").addEventListener("click", () => {
        let changeUser = document.getElementById("change-user-container");
        if(changeUser.style.display == "block"){
            changeUser.style.display = "none"
        }else {
            changeUser.style.display = "block"
        }
    });
    
    const changeUserForm = document.getElementById("change-user-form");
    changeUserForm.addEventListener("submit", async evt => {
        evt.preventDefault();

        const formData = new FormData(changeUserForm);
        const formDataObj = formDataToObject(formData);

        //fetch response 
        const response =  await changeUser(formDataObj);
        const profile = await getUserProfile();
        if(response.status && profile){
            placeTemplate("profile-template.html", "profile.mjs", profile);
            messagehandler(response.message);
        }else{
            messagehandler(response.message);
        }
    });

    const deleteUserBtn = document.getElementById("delete-user-button");
    deleteUserBtn.addEventListener('click', async evt => {
        evt.preventDefault();
        const response =  await deleteUser();
        if(response.status){
            placeTemplate("home-template.html", "home.mjs");
            messagehandler(response.message);
        }else{
            messagehandler(response.message);
        }
    });
}