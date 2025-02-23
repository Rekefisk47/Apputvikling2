class Hashmap {
    constructor(size) {
        this.buckets = new Array(size);
        this.size = size;
    }

    setItem(key, value) {
        //TODO: add dynamic resizing of table?
        //TODO: if key already exist, dont add new or overwrite?

        let index = simpleHash(key, this.size);
        
        if(!this.buckets[index]) {
            this.buckets[index] = [];
        }

        console.log(this.buckets[index][0]);

        this.buckets[index].push([key, value]);

        //console.log(this.buckets[index][0]);
        //console.log(this.buckets[index][0][0]);
       
        //const firstBucket = this.buckets[index][0]; 
        //console.log(firstBucket[0]);
      
    }

    getAllItems(){
        return this.buckets;
        //TODO: loop though all buckets and write it out as json
    }

    getItem(key) {
        //TODO: check if key already exists and do something about it

        let index = simpleHash(key, this.size);

        if(!this.buckets[index]){
            return null;
            console.log("no match :(");
            //throw new Error();
        }
        
        for (let bucket of this.buckets[index]) {
            /*if (bucket[0] === key) { //only checks first value in bucket
                return bucket[1]
            }*/
           return bucket; //gives all values with the key
        }
    }
    //Deletes the whole bucket!!!!
    removeItem(key) {
        //TODO: dont delete all keys in the bucket, only the one with the same name

        let index = simpleHash(key, this.size);

        for (let i = 0; i < this.buckets[index].length; i++) {
            if (this.buckets[index][i][0] == key) {
                console.log("AAA", this.buckets[index][i][0]);
                this.buckets[index][i] = null;
                //this.buckets[index].splice(i,1);
            }
        }
        
    }

}

//-------------------------------------------------------------//

//simple hash 
function simpleHash(key, size){
    let hash = 17;
    for (let i = 0; i < key.length; i++) {
        hash = (13 * hash * key.charCodeAt(i)) % size;
    }
    return hash;
}

//-------------------------------------------------------------//
//for fun: 

//scrabble hash function
function hashFunction(key, size){
    const string = key;
    let result = string.split(' ').join('');

    const values = {
        a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2,
        h: 4, i: 1, j: 8, k: 5, l: 1, m: 3, n: 1,
        o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1,
        v: 4, w: 4, x: 8, y: 4, z: 10, æ: 6, ø: 5, å: 4,
    };   

    let total = 0;

    for(let letter of result.toLowerCase()){
        total += values[letter];
    }
    
    return total % size;
}

//vowel / consonant hash
const reverse = false;
function hashFunction2(key, size){
    const string = key;
    let result = string.split(' ').join('');

    let total = 0;

    for(let letter of result.toLowerCase()){
        if(!reverse){
            if (["a", "e", "i", "o", "u", "y", "æ", "ø", "å"].includes(letter)) {
                total += 1;
            } else {
                total += 2;
            } 
        }else{
            if (["a", "e", "i", "o", "u", "y", "æ", "ø", "å"].includes(letter)) {
                total += 2;
            } else {
                total += 1;
            }
        }
    }

    return total % size;
}

//alphabet hash
function hashFunction3(key, size){
    const string = key;
    let result = string.split(' ').join('');

    const values = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7,
        h: 8, i: 9, j: 10, k: 11, l: 12, m: 13, n: 14,
        o: 15, p: 16, q: 17, r: 18, s: 19, t: 20, u: 21,
        v: 22, w: 23, x: 24, y: 25, z: 26, æ: 27, ø: 28, å: 29,
    };  

    let total = 0;

    for(let letter of result.toLowerCase()){
        total += values[letter];
    }

    return total % size;
}

//-------------------------------------------------------------//

const myMap = new Hashmap(100);

export { myMap };



/*
const myMap = new Hashmap(3);
myMap.setItem("ninja sword", "This Ninjs sword is antique!");
myMap.setItem("stop", "You yell this to get people to stop!");
myMap.setItem("stop", "yes yes. Crow goes boom.");
console.log(myMap.getItem("ninja sword"));
console.log(myMap.getItem("stop"));
console.log(myMap.buckets);
*/

/*
myMap.setItem("bk01", "Bookname");
myMap.setItem("bk02", "Anotherbook");
myMap.setItem("bk03", "BOOKSBOOKSBOOKS");
myMap.setItem("123", "hello");

console.log(myMap.buckets);
console.log(myMap.getItem("bk01"));
console.log(myMap.getItem("bk02"));
console.log(myMap.getItem("bk03"));
*/



