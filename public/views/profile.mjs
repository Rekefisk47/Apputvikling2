import { formDataToObject } from "../modules/formData-to-object.mjs";
import { placeTemplate } from "../modules/load-templates.mjs";
import { messagehandler } from "../modules/message-handler.mjs";
import { changeUser, deleteUser, getUserProfile } from "../modules/fetch-data.mjs";

export async function init(pageData = null){

    const username = document.getElementById("username");
    const userId = document.getElementById("userId");
    username.innerText =  pageData.user.value.username;
    userId.innerText = "My user id is: " + pageData.user.value.userId;

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

    const userWorksContainer = document.getElementById("user-works-container");
    if(pageData.works){
        userWorksContainer.style.display = "block";

        const workData = pageData.works;
        workData.forEach(work => {
            let div = document.createElement("div");
            div.innerHTML = `
                <p><a href="#" id="title-link">Title: ${work.value.title}</a></p>
                <p>Summary: ${work.value.summary}</p>
                <p>Rating: ${work.value.rating}</p>
            `
            div.innerHTML += `Genre: `
            if(typeof work.value.genre === "string"){
                div.innerHTML += `${work.value.genre}`;
            }else if(Array.isArray(work.value.genre)){
                work.value.genre.forEach(genre => {
                    div.innerHTML += `${genre} || `
                });
            }
            div.innerHTML += `<p><a href="#" id="change-link">Change this work</a></p>`
            div.innerHTML += `<hr>`

            let workDiv = document.getElementById("work-div");
            workDiv.appendChild(div);
        });
    }

    document.getElementById("work-div").addEventListener("click", evt => {
        evt.preventDefault();
        console.log(evt.target.id);
        
    });
}