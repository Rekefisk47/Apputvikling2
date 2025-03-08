import createWorkID from "../modules/work-id-generator.mjs";

class Hashmap {
    constructor(tableSize = 16) {
        this.table = new Array(tableSize);
        this.tableSize = tableSize;
    }
 
    hash(key) {
        let hashValue = 7;
        for (let i = 0; i < key.length; i++) {
            hashValue = (hashValue + key.charCodeAt(i) * i) % this.tableSize;
        }
        return hashValue;
    }

    set(key, value){
        const index = this.hash(key);

        if (!this.table[index]) {
            this.table[index] = [];
        }

        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i].key === key) {
                return { message: "This key already exists" };
            }
        }
        
        //adds an id value 
        value["id"] = createWorkID();
    
        this.table[index].push({ key, value });

        return this.table;
    }

    update(key, value){
        const index = this.hash(key);
    
        if (!this.table[index]) {
            return { message: "No match to update" };
        }

        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i].key === key) { 
                this.table[index][i].value = value;

                return this.table;  
            }
        }
        //if no new value set: return 
        return { message: "No match to update" };
    }

    remove(key) {
        const index = this.hash(key);

        if (!this.table[index]) {
            return { message: "No key to remove" };
        }
        let message;
      
        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i].key === key) {

                let match = this.table[index];
                match.splice(i,1);

                if (this.table[index].length === 0) {
                        this.table[index] = null;
                }
                return this.table;

            }else if(this.table[index][i].key != key){
                message = { message: "No key to remove" };
            }
        }
        return message;
    }
    
    get(key) {
        const index = this.hash(key);

        if (!this.table[index]) {
            return null;
        }

        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i].key === key) {
                return this.table[index][i];
            }
        }
    }

    getAll(){
        //Creates a list object and returns
        let list = {};
        this.table.forEach((bucket, index) => {
            if (bucket) {
                bucket.forEach((obj) => {
                    console.log(obj);
                    list[obj.value.id] = obj.value;
                });
            }
        });
        return list;
        //return this.table;
    }
}

const hashMap = new Hashmap();
const userMap = new Hashmap();
const userWorkMap = new Hashmap();

export { hashMap, userMap, userWorkMap };