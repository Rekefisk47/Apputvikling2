import { formDataToObject } from "../modules/formData-to-object.mjs";
import { placeTemplate } from "../modules/load-templates.mjs";
import { messagehandler } from "../modules/message-handler.mjs";
import { changeUser, getProfile, deleteUser, getAllUsersWorks, deleteWork } from "../modules/fetch-data.mjs";

export async function init(pageData = null){
    const userId = pageData.result.id;
    const username = pageData.result.value.username;

    //
    const usernameHTML = document.getElementById("username");
    const userIdHTML = document.getElementById("userId");
    usernameHTML.innerText =  username;
    userIdHTML.innerText = "My user id is: " + userId;

    //
    document.getElementById("changeBtn").addEventListener("click", () => {
        let changeUser = document.getElementById("change-user-container");
        if(changeUser.style.display == "block"){
            changeUser.style.display = "none"
        }else {
            changeUser.style.display = "block"
        }
    });
    
    //
    const changeUserForm = document.getElementById("change-user-form");
    changeUserForm.addEventListener("submit", async evt => {
        evt.preventDefault();

        const formData = new FormData(changeUserForm);
        const formDataObj = formDataToObject(formData);

        //fetch response 
        document.getElementById("loading").showModal();
        const response =  await changeUser(formDataObj);
        if(response.newUser){
            const profile = await getProfile();
            placeTemplate("profile-template.html", "profile.mjs", profile);
        }
        messagehandler(response.message);
        document.getElementById("loading").close();
    });

    //
    const deleteUserBtn = document.getElementById("delete-user-button");
    deleteUserBtn.addEventListener('click', async evt => {
        evt.preventDefault();
        
        document.getElementById("loading").showModal();
        const response =  await deleteUser();
        document.getElementById("loading").close();
        if(response.result){
            placeTemplate("home-template.html", "home.mjs");
        }
        messagehandler(response.message);
    });


    //------------------------------------------------//

    const result =  await getAllUsersWorks(userId)
    const works = result.works;

    const userWorksContainer = document.getElementById("user-works-container");
    if(works){
        userWorksContainer.style.display = "block";

        works.forEach(work => {
            const workId = work.id;
            let title = work.value.title;
            let summary = work.value.summary;
            let rating = work.value.rating;
            let genre = work.value.genre;           

            let div = document.createElement("div");
            div.innerHTML = `
                <p><b>Title: <a href="#" id="title" class="${workId}">${title}</a></b></p>
            `
            if(summary){
                div.innerHTML += `<p>Summary: ${summary}</p>`
            }
            if(rating){
                div.innerHTML += `<p>Rating: ${rating}</p>`
            }


            if(genre){
                div.innerHTML += `Genre: `
                if(typeof work.value.genre === "string"){
                    div.innerHTML += `${work.value.genre}`;
                }else if(Array.isArray(genre)){
                    genre.forEach(genre => {
                        div.innerHTML += `${genre} || `
                    });
                }
            }

            div.innerHTML += `<p><a href="#" id="change-work-link" class="${workId}">Change this work</a></p>`
            div.innerHTML += `<p><a href="#" id="delete-work-link" class="${workId}">Delete this work</a></p>`
            div.innerHTML += `<button id="delete-work-btn" class="${workId}-button" style="display:none">Delete this work</button>`
            div.innerHTML += `<hr>`

            let workDiv = document.getElementById("work-div");
            workDiv.appendChild(div);
        });
    }

    document.getElementById("work-div").addEventListener("click", evt => {
        evt.preventDefault();

        works.forEach(work => {
            const workId = work.id;

            if((workId == evt.target.className) && (evt.target.id === "change-work-link")){
                placeTemplate("change-work-template.html", "change-work.mjs", work);

            }else if((workId == evt.target.className) && (evt.target.id === "title")){
                placeTemplate("show-work-template.html", "show-work.mjs", work.value );

            }else if((workId == evt.target.className) && (evt.target.id === "delete-work-link")){
                const deleteBtn = document.getElementsByClassName(workId+"-button");
                
                if(deleteBtn[0].style.display == "block"){
                    deleteBtn[0].style.display = "none";
                }else {
                    deleteBtn[0].style.display = "block";
                }

                deleteBtn[0].addEventListener("click", async (evt) => {
                    evt.preventDefault();
                   
                    document.getElementById("loading").showModal();
                    let response =  await deleteWork(workId);
                    messagehandler(response.message);
                    if(response.work){
                        const profile = await getProfile();
                        placeTemplate("profile-template.html", "profile.mjs", profile);
                    }
                    document.getElementById("loading").close();
                })
            }
        });
    });
}




