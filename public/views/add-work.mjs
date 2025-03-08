import { placeTemplate } from "../modules/load-templates.mjs";
import { formDataToObject } from "../modules/formData-to-object.mjs";
import { addWork } from "../modules/fetch-data.mjs";
import { messagehandler } from "../modules/message-handler.mjs";

export function init(pageData = null) {

    const workForm = document.getElementById("work-form");
   
    //---------------iframe----------------//
    const tools = document.getElementById("tools");
    const iframe = document.getElementById("content");
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

    //---------------Add work--------------//
    //export work formdata
    workForm.addEventListener("submit", async evt => {
        evt.preventDefault();
        const formData = new FormData(workForm);

        const iframe = document.getElementById('content');
        const content = iframe.contentDocument.body.innerHTML;
        formData.append('content', content);
        
        appendGenre(formData);  
                    
        const formDataObj = formDataToObject(formData);
       
        //give message
        let response =  await addWork(formDataObj);
        console.log("RESPONSE:");
        console.log(response);
        if(response.status){
            messagehandler(response.message);
            placeTemplate("browse-works-template.html", "browse-works.mjs");
        }else{
            messagehandler(response.message);
        }
    });
    //---------------Add work--------------//
}