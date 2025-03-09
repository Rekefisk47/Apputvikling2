/*
class Item{
    constructor(recordStore, description, state, id){
        this.id = id || Date.now();
        this.description = description;
        this.state = state;
        this.recordStore = recordStore; //abstraksjon av 'database'
    }

    read(id){
        let data = this.recordStore.read(id);
        this.id = id;
        this.description = data.description;
        this.state = data.state;
    }

    update(){
        this.recordStore.update(this);
    }
    
    delete(id){
        this.recordStore.delete(this);
    }
}
*/

function RecordStoreAbstractInterface(){
    return {
        create,
        read,
        update,
        purge
    }
}

function create(id){throw Error("Not implemented")}
function update(item){throw Error("Not implemented")}
function read(item){throw Error("Not implemented")}
function purge(item){throw Error("Not implemented")}

export default RecordStoreAbstractInterface
/*
class ItemRecordStore extends RecordStoreAbstractInterface{
    create(id, description, state){
        const `Insert into TodoList(id, decription, state) values($1,$2,$3)`;
        //const `Insert into TodoList(id, decription, state) values(${id},${description},${state})`;
    }
}
*/