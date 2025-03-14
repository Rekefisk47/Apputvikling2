import { formDataToObject } from "../modules/formData-to-object.mjs";
import { placeTemplate } from "../modules/load-templates.mjs";
import { messagehandler } from "../modules/message-handler.mjs";
import { editWork, getProfile } from "../modules/fetch-data.mjs";

export async function init(pageData = null){

    const changeWorkForm = document.getElementById("change-work-form");

    const tools = document.getElementById("tools");
    const iframe = document.getElementById("content");

    //---------------iframe----------------//
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    iframeDoc.open();
    iframeDoc.write('<!DOCTYPE html><html><body contenteditable="true"></body></html>');
    iframeDoc.close();

    iframeDoc.addEventListener("click", iframeFocus);

    function formatText(tag) {
        iframe.contentWindow.document.execCommand(tag, false, null);
    }
    function iframeFocus(){
        iframe.contentWindow.document.body.focus();
    }

    tools.addEventListener("click", async evt => {
        evt.preventDefault();
        const isButton = evt.target.nodeName === 'BUTTON';
        if(!isButton){
            return;
        }
        if(evt.target.id == "Bold"){
            formatText('bold');
        }else if(evt.target.id == "Italic"){
            formatText('italic');
        }
        iframe.contentWindow.document.body.focus();
    });

    //keyboard shortcuts 
    iframeDoc.addEventListener('keydown', function(evt) {
        if ((evt.metaKey || evt.ctrlKey) && evt.key === 'b') {
            evt.preventDefault();
            formatText('bold');
        }else if((evt.metaKey || evt.ctrlKey) && evt.key === 'i') {
            evt.preventDefault();
            formatText('italic');
        }
    });
    //---------------iframe----------------//



    //---------------Get and place info--------------//
    const workData = pageData.value;
    if (workData) {
        addToForm(changeWorkForm, workData);
    }
    
    function addToForm(form, data) {
        
        for(let value in data){
            const input = form.querySelector(`[name="${value}"]`);

            //if its a normal fields
            if(input && (input.type != "checkbox")){
                input.value = data[value]; 
            }

            //if checkbox field and there is an array
            if(value === "genre" && Array.isArray(data[value])){       
                data[value].forEach((value) => { 
                    //only get boxes with same value
                    const checkbox = form.querySelector(`[value="${value}"]`);
                    checkbox.checked = true;
                });
            }else if(value === "genre" && !Array.isArray(data[value])){//if there is only one genre
                const checkbox = form.querySelector(`[value="${data[value]}"]`);
                checkbox.checked = true;
            }

            //if iframe field
            if(value === "content"){
                iframeDoc.open();
                iframeDoc.write(`<!DOCTYPE html><html><body contenteditable="true">`+ data[value] +`</body></html>`);
                iframeDoc.close();
                iframeDoc.addEventListener("click", iframeFocus);
            }
        }
    }
    //---------------Get and place info--------------//
    
    //---------------Change work--------------//
    changeWorkForm.addEventListener("submit", async evt => {
        evt.preventDefault();

        const formData = new FormData(changeWorkForm);
        appendGenre(formData);  
        appendIframe(formData);
        const formDataObj = formDataToObject(formData);
        
        document.getElementById("loading").showModal();
        let response = await editWork(pageData.id, formDataObj); 
        document.getElementById("loading").close();
        messagehandler(response.message);
        if(response.work){
            const profile = await getProfile();
            placeTemplate("profile-template.html", "profile.mjs", profile);
        }
    });
}

//---------------Append Genre--------------//
function appendGenre(formData){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        if(checkbox.checked === true){
            formData.append("genre", checkbox.value);
        }
    });
    return formData;
}
//---------------Append Genre--------------//
//---------------Append iframe--------------//
function appendIframe(formData){
    const iframe = document.getElementById('content');
    const content = iframe.contentDocument.body.innerHTML;
    formData.append('content', content);
}
//---------------Append iframe--------------//
