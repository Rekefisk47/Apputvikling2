
class Hashmap {
    constructor(tableName, tableSize = 16) {
        this.table = new Array(tableSize);
        this.tableSize = tableSize;
        this.tableName = tableName;
    }
 
    hash(key) { //TODO: add so a single number gets hashes differnlty?
        let key2 = "key" + key; 
        console.log(key2);
        let hashValue = 7;
        for (let i = 0; i < key2.length; i++) {
            hashValue = (hashValue + key2.charCodeAt(i) * i) % this.tableSize;
        }
        return hashValue;
    }

    set(key, value){
        console.log("SETT VALUE:", key, value);
        const index = this.hash(key);
        console.log("@@@@@", index);

        if (!this.table[index]) {
            this.table[index] = [];
        }

        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i].key === key) {
                return { message: "This key already exists" };
            }
        }
        
        this.table[index].push({ key, value });

        return this.table;
    }

    //updates value 
    update(key, value){
        const index = this.hash(key);

        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i].key == key) { 
                this.table[index][i].value = value;
                return this.table;
            }
        }
        return this.table;
    }

    //updates key
    updateKey(oldKey, newKey){
        const oldIndex = this.hash(oldKey);
        const newIndex = this.hash(newKey);
        /*
        console.log(oldKey, newKey);
        console.log(oldIndex, newIndex);
        console.log(this.table);
        console.log(this.table[oldIndex]);
        */
        if (!this.table[oldIndex]) {
            return { message: "No match to update" };
        }
        
        for (let i = 0; i < this.table[oldIndex].length; i++) {
            if(this.table[oldIndex][i].key === oldKey){

                //stores the value of entry
                const removedEntry = this.table[oldIndex].splice(i, 1)[0];
                
                //Insert the entry with the new key
                if (!this.table[newIndex]) {
                    this.table[newIndex] = [];
                }
                removedEntry.key = newKey;
                removedEntry.value.username = newKey;
                this.table[newIndex].push(removedEntry);

                //makes empty array null
                if (this.table[oldIndex].length === 0) {
                    this.table[oldIndex] = null;
                }

                return this.table;
            }
            /*if (this.table[oldIndex][i].key === oldKey) { 
                // Remove the old key-value pair
                const [removedEntry] = this.table[oldIndex].splice(i, 1);
                
                // Assign new key and insert into the new index
                removedEntry.key = newKey;
                
                if (!this.table[newIndex]) {
                    this.table[newIndex] = [];
                }
                this.table[newIndex].push(removedEntry);
    
                return this.table;
            }*/
        }
        return { message: "Couldnt update" };
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
        console.log("THIS TABLE:",this.table);
        let list = {};
        this.table.forEach((bucket, index) => {
            if (bucket) {
                bucket.forEach((obj) => {
                    console.log("BUCKET OBJ: ", obj);
                    list[obj.key] = obj.value;
                });
            }
        });
        return list;
        //return this.table;
    }
}

const hashMap = new Hashmap("works");
const userMap = new Hashmap("users");
const userWorkMap = new Hashmap("user_work_map");

export { hashMap, userMap, userWorkMap };