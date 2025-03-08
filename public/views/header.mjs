import { placeTemplate } from "../modules/load-templates.mjs";

export async function init(pageData = null) {
  
    document.getElementById("homeBtn").addEventListener("click", () => {
        placeTemplate("home-template.html", "home.mjs");
    });
    document.getElementById("loginBtn").addEventListener("click", () => {
        placeTemplate("login-user-template.html", "login-user.mjs");
    });
    document.getElementById("browseBtn").addEventListener("click", () => {
        placeTemplate("browse-works-template.html", "browse-works.mjs");
    });
    document.getElementById("addBtn").addEventListener("click", () => {
        placeTemplate("add-work-template.html", "add-work.mjs");
    });
    document.getElementById("profileBtn").addEventListener("click", () => {
        placeTemplate("profile-template.html", "profile.mjs");
    });
}