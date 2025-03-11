import pg from 'pg';

const config = {
    connectionString: process.env.DB_CREDENTIALS,
    ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false,
}

//await client.connect();

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

async function runQuery(query, ...values){
    const client = new pg.Client(config);
    try{

        await client.connect();
        const result = client.query(statment, [...values]);

        if(result.rowcount <= 0){
           throw new Error("No records stated"); 
        }

        return result.row[0];

    }catch(error){

        //feilhåndtering
        console.log(error);
        return null;
        
    }finally{
        client.close();
    }
}

export { create, update, read, purge};