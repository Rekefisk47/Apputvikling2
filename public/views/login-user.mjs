import { placeTemplate } from "../modules/load-views.mjs";

export function init() {
    console.log("Login user script loaded");

    document.getElementById("create-user-link").addEventListener("click", () => {
        placeTemplate("create-user-template.html", "create-user.mjs");
    });
}