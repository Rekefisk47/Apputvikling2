
import pkg from "pg";
const { Client } = pkg;

const config = {
    connectionString: process.env.DB_CREDENTIALS,
    ssl: { rejectUnauthorized: false }
    //ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false,
}

async function runQuery(query, ...values){
    const client = new Client(config);
    try{

        await client.connect();
        const result = await client.query(query, values);

        if(result.rowCount <= 0 ){
            console.log(result);
            throw new Error("Nothing happened in database!");
        } 

        console.log("Connected to database");
        return result;

    }catch(error){

        console.log("Connection error: ", error);
        return null;
        
    }finally{
        console.log("Database closed");
        client.end();
    }
}

async function create(statement, ...values){
    return await runQuery(statement, ...values);
}
async function update(statement, ...values){
    return await runQuery(statement, ...values);
}
async function read(statement, ...values){
    return await runQuery(statement, ...values);
}
async function purge(statement, ...values){
    return await runQuery(statement, ...values);
}

export { create, update, read, purge };