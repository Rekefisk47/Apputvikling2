import { placeTemplate } from "../modules/load-views.mjs";

export async function init() {
    console.log("Header script loaded");

    document.getElementById("homeBtn").addEventListener("click", () => {
        placeTemplate("home-template.html", "home.mjs");
    });
    document.getElementById("userBtn").addEventListener("click", () => {
        placeTemplate("login-user-template.html", "login-user.mjs");
    });
    document.getElementById("browseBtn").addEventListener("click", () => {
        placeTemplate("browse-works-template.html", "browse-works.mjs");
    });
    document.getElementById("addBtn").addEventListener("click", () => {
        placeTemplate("add-work-template.html", "add-work.mjs");
    });
}