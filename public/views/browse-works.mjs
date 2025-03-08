import { placeTemplate } from "../modules/load-templates.mjs";
import { getAllWorks } from "../modules/fetch-data.mjs";

export async function init(pageData = null) {

    let worksContainer = document.getElementById("works-container");
    let works = await getAllWorks();
    console.log(works);
    Object.entries(works).forEach(([key, value]) => {
        /*console.log('----------------------');
        console.log(key, value);*/
        
        let div = document.createElement("div");
        div.id = key;
        div.innerHTML = `Work-id: ${key} <br> Title: <a href="#" id="link">${value.title}</a> <br> Author: ${value.author} <br>`;
        if(value.summary){
            div.innerHTML += `Summary: ${value.summary} <br>`;
        }
        div.innerHTML += `<hr>`;

        worksContainer.appendChild(div);

        const link = div.querySelector("#link");
        link.addEventListener("click", (evt) => {
            evt.preventDefault();
            placeTemplate("show-work-template.html", "show-work.mjs", value);
        });
    });
}