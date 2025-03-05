
async function fetchTemplate(templateName){
    try {
        const response = await fetch(`/templates/${templateName}`);
       
        if(!response.ok){
            throw new Error(response.status);
        }

        const templateText = await response.text(); //gets template as text
        
        let div = document.createElement("div");
        div.innerHTML = templateText;
        let template = div.querySelector("template");

        return template;
    }catch(error){
        console.log(`No template ${template} found: ` + error);
    }
}

async function fetchModule(moduleName){
    try {
        const module = await import(`../views/${moduleName}`);
        return module;
    } catch (error) {
        console.error(`No module ${moduleName} found: ` + error);
    }
}

//-------------------------------------------------------//

export async function placeTemplate(templateName, moduleName){
    const templateContainer = document.getElementById("template-container");

    //gets and clones header template
    const header = await fetchTemplate("header-template.html");
    const headerClone = header.content.cloneNode(true);
   
    //gets and clones template
    const template = await fetchTemplate(templateName);
    const clone = template.content.cloneNode(true);
    
    templateContainer.replaceChildren(headerClone, clone);

    //initiate scripts
    const module = await fetchModule(moduleName);
    if (module && module.init) {
        module.init();
    }
    const headerModule = await fetchModule("header.mjs");
    if (headerModule && headerModule.init) {
        headerModule.init();
    }
}

//Start template
placeTemplate("home-template.html", "home.mjs");