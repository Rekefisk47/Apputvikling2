import { placeTemplate } from "../modules/load-templates.mjs";
import { getAllWorks } from "../modules/fetch-data.mjs";
import { messagehandler } from "../modules/message-handler.mjs";

export async function init(pageData = null) {

    let worksContainer = document.getElementById("works-container");
    document.getElementById("loading").showModal();
    let works = await getAllWorks();
    document.getElementById("loading").close();
    console.log("////", works);

    if(works.status != false){
        Object.entries(works).forEach(([key, value]) => {
            const fieldset = document.createElement("fieldset");
            fieldset.className = "work-wrapper";
            fieldset.style.marginTop = "10px";

            let div = document.createElement("div");
            div.style.padding = "10px";
            div.id = value.id;
            
            div.innerHTML = `<h3 style="margin:0"> Title: <a href="#" id="link">${value.value.title}</a></h3> Author: ${value.value.author} <br>`;
            if(value.value.rating){
                div.innerHTML += `Rating: ${value.value.rating}  <br>`;
            }
            if(value.value.summary){
                div.innerHTML += `Summary: ${value.value.summary} <br>`;
            }

            fieldset.appendChild(div);
            worksContainer.appendChild(fieldset);

            const link = div.querySelector("#link");
            link.addEventListener("click", (evt) => {
                evt.preventDefault();
                placeTemplate("show-work-template.html", "show-work.mjs", value.value);
            });
        });
    }else{
        messagehandler(works.message);
    }
}