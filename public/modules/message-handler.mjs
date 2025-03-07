
export function messagehandler(_message) {
    const message = _message || "An unknown error has occured. Please try again later.";
    
    let messageContainer = document.getElementById("message-container");
    messageContainer.innerHTML = "";

    //create dialog box
    let dialog = document.createElement("dialog");
    dialog.innerHTML = `
        <h3 id="message">${message}</h3>
        <button id="closeDialog">Close</button>
    `;
    messageContainer.appendChild(dialog);
    dialog.addEventListener("click", function (evt) {
        if (evt.target.id == "closeDialog") {
            dialog.close();
            document.body.style.overflow = "auto";
        }
    });
    dialog.showModal();
    document.body.style.overflow = "hidden";
}