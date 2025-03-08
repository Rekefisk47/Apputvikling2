
export async function init(pageData = null){
    console.log("you: ", pageData);
    let username = document.getElementById("username");
    let userId = document.getElementById("userId");
    username.innerHTML =  pageData.user.value.username;
    userId.innerHTML = pageData.user.value.id;
}