import { formDataToObject } from "../modules/formData-to-object.mjs";
import { placeTemplate } from "../modules/load-templates.mjs";
import { messagehandler } from "../modules/message-handler.mjs";
import { changeUser, deleteUser, deleteWork, getUserProfile } from "../modules/fetch-data.mjs";

export async function init(pageData = null){

    const username = document.getElementById("username");
    const userId = document.getElementById("userId");
    username.innerText =  pageData.user.value.username;
    userId.innerText = "My user id is: " + pageData.user.id;

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
        document.getElementById("loading").showModal();
        const response =  await changeUser(formDataObj);
        const profile = await getUserProfile();
        if(response.status && profile){
            placeTemplate("profile-template.html", "profile.mjs", profile);
            messagehandler(response.message);
        }else{
            messagehandler(response.message);
        }
        document.getElementById("loading").close();
    });

    const deleteUserBtn = document.getElementById("delete-user-button");
    deleteUserBtn.addEventListener('click', async evt => {
        evt.preventDefault();
        document.getElementById("loading").showModal();
        const response =  await deleteUser();
        if(response.status){
            placeTemplate("home-template.html", "home.mjs");
            messagehandler(response.message);
        }else{
            messagehandler(response.message);
        }
        document.getElementById("loading").close();
    });

    const userWorksContainer = document.getElementById("user-works-container");
    if(pageData.works){
        userWorksContainer.style.display = "block";

        const workData = pageData.works;
        workData.forEach(work => {
            let div = document.createElement("div");
            div.innerHTML = `
                <p><b>Title: <a href="#" id="title" class="${work.key}">${work.value.title}</a></b></p>
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
            div.innerHTML += `<p><a href="#" id="change-work-link" class="${work.key}">Change this work</a></p>`
            div.innerHTML += `<p><a href="#" id="delete-work-link" class="${work.key}">Delete this work</a></p>`
            div.innerHTML += `<button id="delete-work-btn" class="${work.key}-button" style="display:none">Delete this work</button>`
            div.innerHTML += `<hr>`

            let workDiv = document.getElementById("work-div");
            workDiv.appendChild(div);
        });
    }

    document.getElementById("work-div").addEventListener("click", evt => {
        evt.preventDefault(); 
        pageData.works.forEach(work => {
            if((work.key == evt.target.className) && (evt.target.id === "change-work-link")){
                placeTemplate("change-work-template.html", "change-work.mjs", work);
            }else if((work.key == evt.target.className) && (evt.target.id === "title")){
                for (let i = 0; i < pageData.works.length; i++) {
                    if(pageData.works[i].id == work.key){
                        placeTemplate("show-work-template.html", "show-work.mjs", pageData.works[i].value);
                    }
                }
            }else if((work.key == evt.target.className) && (evt.target.id === "delete-work-link")){
            
                const deleteBtn = document.getElementsByClassName(work.key+"-button");
                if(deleteBtn[0].style.display == "block"){
                    deleteBtn[0].style.display = "none";
                }else {
                    deleteBtn[0].style.display = "block";
                }

                deleteBtn[0].addEventListener("click", async (evt) => {
                    evt.preventDefault();
                    
                    document.getElementById("loading").showModal();
                    let response =  await deleteWork(work.key);
                    if(response.status){
                        messagehandler(response.message);
                        //reload profile
                        const profile = await getUserProfile();
                        placeTemplate("profile-template.html", "profile.mjs", profile);
                    }else{
                        messagehandler(response.response.message);
                    }
                    document.getElementById("loading").close();
                })
            }
        });
    });
}




