
import { create, update, read, purge } from "./db.mjs";

const ALLOWED_TABLES = ["users", "works", "user_work_map"];

class Hashmap {
    constructor(tableName) {
        if (!ALLOWED_TABLES.includes(tableName)) {
            throw new Error(`Invalid table name: ${tableName}`);
        }
        this.table = new Array();
        this.tableName = tableName;
    }

    async set(key, value){
        const result = await create(`INSERT INTO "public"."${this.tableName}" ("key", "value") VALUES ($1, $2::jsonb) RETURNING *`, key, JSON.stringify(value));
        if(result){
            return result.rows[0];
        }else{
            return null;
        }
    }
    
    async get(key){
        if(this.tableName == "works"){
            const result = await read(`SELECT id, value FROM "public"."${this.tableName}" WHERE id = $1`, key);
            if(result){
                return result.rows[0];
            }else{
                return false;
            }
        }else if(this.tableName == "user_work_map"){
            const result = await read(`SELECT * FROM "public"."works" WHERE "key" = $1`, key);
            if(result){
                return result.rows;
            }else{
                return false;
            }
        }else{
            const result = await read(`SELECT id, key, value FROM "public"."${this.tableName}" WHERE "key" = $1`, key);
            if(result){
                return result.rows[0];
            }else{
                return false;
            }
        }
    }

    async getAll(){
        const result = await read(`SELECT * FROM "public"."${this.tableName}"`);
        if(result){
            return result.rows;
        }else{
            return false;
        }
    }

    async update(oldkey, newKey, value){
        if(this.tableName == "works"){                                                                            //key   authorID   value
            const result = await update(`UPDATE "public"."${this.tableName}" SET key = $2, value = $3::jsonb WHERE id = $1 RETURNING *`, oldkey, newKey, JSON.stringify(value));
            if(result){
                return result.rows[0];
            }else{
                return false;
            }
        }else{
            const result = await update(`UPDATE "public"."${this.tableName}" SET  key = $2, value = $3::jsonb WHERE key = $1 RETURNING *`, oldkey, newKey, JSON.stringify(value));
            if(result){
                return result.rows[0];
            }else{
                return false;
            }
        }
    }

    async remove(key){
        if(this.tableName == "works"){
            const result = await purge(`DELETE FROM "public"."${this.tableName}" WHERE "id" = $1 RETURNING *`, key);
            if(result){
                return result.rows[0];
            }else{
                return false;
            }
        }else{
            const result = await purge(`DELETE FROM "public"."${this.tableName}" WHERE "key" = $1 RETURNING *`, key);
            if(result){
                return result.rows[0];
            }else{
                return false;
            }
        }
    }
}

const userMap = new Hashmap("users");
const workMap = new Hashmap("works");
const userWorkMap = new Hashmap("user_work_map"); 

export { userMap, workMap, userWorkMap };