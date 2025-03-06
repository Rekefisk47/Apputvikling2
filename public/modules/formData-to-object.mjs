
//creates a normal object from formdata
//creates an array if key has multiple values

export function formDataToObject(formData){
    const formDataObj = {};
    formData.forEach((value, key) => {
        if (formDataObj[key] && !formDataObj[key].includes(value)) { //if already exists
            formDataObj[key] = [].concat(formDataObj[key], value);
        } else {
            formDataObj[key] = value;
        }
    });
    return formDataObj;
}
