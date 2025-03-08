import { placeTemplate } from "../modules/load-templates.mjs";
import { messagehandler } from "../modules/message-handler.mjs";

export function init(pageData = null) {
    console.log(pageData);

    const backBtn = document.getElementById("back");
    const backToTopBtn = document.getElementById("top");
    let title = document.getElementById("title");
    let author = document.getElementById("author");
    let summary = document.getElementById("summary");
    let content = document.getElementById("content");

    title.innerHTML = pageData.title;
    author.innerHTML = `<a href="#" id="authorLink">${pageData.author}</a>`
    summary.innerHTML = pageData.summary;
    content.innerHTML = pageData.content;

    backBtn.addEventListener("click", (evt) => {
        evt.preventDefault();
        placeTemplate("browse-works-template.html", "browse-works.mjs");
    });

    backToTopBtn.addEventListener("click", (evt) => {
        evt.preventDefault();
        window.scrollTo(0, 0);
    });

    authorLink.addEventListener("click", (evt) => {
        evt.preventDefault();
        messagehandler("See what else this user has written? To be added...");
    });
}