import { create, update, read, purge } from "./db.mjs";

const ALLOWED_TABLES = ["users", "works", "user_work_map"];

class Hashmap {
    constructor(tableName, tableSize = 16) {
        if (!ALLOWED_TABLES.includes(tableName)) {
            throw new Error(`Invalid table name: ${tableName}`);
        }
        this.table = new Array(tableSize);
        this.tableSize = tableSize;
        this.tableName = tableName;
    }
    
    //first time you get something from database
    //put it in local for faste lookup
    async loadFromDatabase(tableName) {
        const result = await read(`SELECT key, value FROM "public"."${tableName}"`);
        /*
        console.log("+++++¨¨¨+++++");
        console.log(result.rows);
        console.log(result.rows.length);
        console.log("+++++¨¨¨+++++");
        */
        if(result.rows.length > 0){
            let item = result.rows;
            for (let i = 0; i < result.rows.length; i++) {
                console.log(item[i]);
                console.log(item[i].key);

                let index = this.hash(item[i].key);
                if (!this.table[index]) {
                    this.table[index] = [];
                }
                this.table[index].push(item[i]);

                console.log(this.table, "FINISH");
            }
        }
    }
 
    hash(key) { //TODO: add so a single number gets hashes differnlty?
        let key2 = "key-" + key; 
        let hashValue = 7;
        for (let i = 0; i < key2.length; i++) {
            hashValue = (hashValue + key2.charCodeAt(i) * i) % this.tableSize;
        }
        return hashValue;
    }

    async set(key, value){
        /*
        const index = this.hash(key);
        //saves to local hashmap
        if (!this.table[index]) {
            this.table[index] = [];
        }
        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i].key === key) {
                return { message: "This key already exists" };
            }
        }
        this.table[index].push({ key, value });
        */

        if(key === null){ //works
            const inserted = await create(`INSERT INTO "public"."${this.tableName}" ("key", "value") VALUES ($1, $2::jsonb) RETURNING *`, "placeholder", value);
            const result = await update(`UPDATE "public"."${this.tableName}" SET key = $1 WHERE key = $2 RETURNING *`, inserted.rows[0].id, inserted.rows[0].key );
            //console.log("#######");
            //console.log(result); 
            //console.log("#######");
            if (!inserted || inserted.rows.length === 0) {
                throw new Error("Failed to insert work into Database");
            }
            return result;
        }else{ //users
            //saves to database (useres = works)
            const result = await create(`INSERT INTO "public"."${this.tableName}" ("key", "value") VALUES ($1, $2::jsonb) RETURNING *`, key, JSON.stringify(value));
            if(!result || result.rows.length === 0){
                throw new Error("Failed to insert item into Database");
            }
        }
    
        
        //return this.table;
    }

    //updates value 
    async update(key, value){
        //updates value in database
        const result = await update(`UPDATE "public"."${this.tableName}" SET value = $2::jsonb WHERE key = $1 RETURNING id`, key, JSON.stringify(value));
        //console.log("++++++++++");
        //console.log(result); 
        //console.log("++++++++++");
        if(!result || result.rows.length === 0){
            throw new Error("Failed to update VALUE in Database");
        }
    
        return { success: true, message: "Value updated successfully!", id: result.rows[0].id };
        /*
    

        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i].key == key) { 
                this.table[index][i].value = value;
      
                return this.table;
            }
        }
        return this.table;
        */
    }

    //updates key
    async updateKey(oldKey, newKey){
        const oldIndex = this.hash(oldKey);
        const newIndex = this.hash(newKey);
        /*
        console.log(oldKey, newKey);
        console.log(oldIndex, newIndex);
        console.log(this.table);
        console.log(this.table[oldIndex]);
        */
        console.log("Updating key in table:", this.tableName);
        console.log("Old key:", oldKey);
        console.log("New key:", newKey);
        console.log(this.tableName, "<----->");

        // Update the key in the database
        const test = await read(
            `SELECT key, value FROM "public"."${this.tableName}" WHERE "key" = $1;`, oldKey.toString());        
        console.log("Check if oldKey exists:", test);

        const result = await update(`UPDATE "public"."${this.tableName}" SET key = $2 WHERE key = $1 RETURNING *;`, oldKey, newKey);
        console.log("&&&&&&&");
        console.log(result);
        console.log("&&&&&&&");
        if ((!result || result.rows.length === 0) && this.tableName === "users") {
            throw new Error("Failed to update KEY in Database", oldKey, newKey);
        }
        console.log("Key updated successfully.");

        /*
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
            */
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
        //}
        //return { message: "Couldnt update" };
    }

    async remove(key) {
        if(this.tableName == "users"){
            await purge(`DELETE FROM "public"."${this.tableName}" WHERE "key" = $1 RETURNING *;`, key);
            return { message : "Removed user!" };
        }else if(this.tableName == "works"){
            await purge(`DELETE FROM "public"."${this.tableName}" WHERE "key" = $1;`, key);
        }
      
        /*
        const index = this.hash(key);

        if (!this.table[index]) {
            return { message: "No key to remove" };
        }
        let message;

        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i].key === key) {
                //delete from local hashmap
                let match = this.table[index];
                match.splice(i,1);
                if (this.table[index].length === 0) {
                    this.table[index] = null;
                }

                //delete from database
                const result = await purge(`DELETE FROM "public"."${this.tableName}" WHERE key = $1;`, key);
                console.log("++++++++++");
                console.log(result); 
                console.log("++++++++++");
                if(!result){
                    throw new Error("Failed to delete item into Database");
                }

                return this.table;

            }else if(this.table[index][i].key != key){
                message = { message: "No key to remove" };
            }
        }

        return message;
        */
    }
    
    async get(key) {
        //Get from database
        const result = await read(`SELECT id, key, value FROM "public"."${this.tableName}" WHERE key = $1`, key);
        if(result && result.rows && result.rows.length <= 0){
            return false;
        }else{
            console.log(result.rows[0]);
            return result.rows[0];
        }
    }

    async getAll(){ //gets all entries
        

        const result = await read(`SELECT * FROM "public"."${this.tableName}"`);
        return result.rows;


        /*
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
        */
    }
}

const hashMap = new Hashmap("works");
const userMap = new Hashmap("users");
const userWorkMap = new Hashmap("user_work_map");

export { hashMap, userMap, userWorkMap };