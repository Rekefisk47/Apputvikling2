
export function createDeck(uuid){
    const uniqueId = uuid;
    const deck = {
        "deck_id": uniqueId,
        "deck":[
            {
                "suit": "hearts",
                "value": 2
            },
            {
                "suit": "hearts",
                "value": 3
            },
            {
                "suit": "hearts",
                "value": 4
            },
            {
                "suit": "hearts",
                "value": 5
            },
            {
                "suit": "hearts",
                "value": 6
            },
            {
                "suit": "hearts",
                "value": 7
            },
            {
                "suit": "hearts",
                "value": 8
            },
            {
                "suit": "hearts",
                "value": 9
            },
            {
                "suit": "hearts",
                "value": 10
            },
            {
                "suit": "hearts",
                "value": "J"
            },
            {
                "suit": "hearts",
                "value": "Q"
            },
            {
                "suit": "hearts",
                "value": "K"
            },
            {
                "suit": "hearts",
                "value": "A"
            },
            {
                "suit": "diamonds",
                "value": 2
            },
            {
                "suit": "diamonds",
                "value": 3
            },
            {
                "suit": "diamonds",
                "value": 4
            },
            {
                "suit": "diamonds",
                "value": 5
            },
            {
                "suit": "diamonds",
                "value": 6
            },
            {
                "suit": "diamonds",
                "value": 7
            },
            {
                "suit": "diamonds",
                "value": 8
            },
            {
                "suit": "diamonds",
                "value": 9
            },
            {
                "suit": "diamonds",
                "value": 10
            },
            {
                "suit": "diamonds",
                "value": "J"
            },
            {
                "suit": "diamonds",
                "value": "Q"
            },
            {
                "suit": "diamonds",
                "value": "K"
            },
            {
                "suit": "diamonds",
                "value": "A"
            },
            {
                "suit": "clubs",
                "value": 2
            },
            {
                "suit": "clubs",
                "value": 3
            },
            {
                "suit": "clubs",
                "value": 4
            },
            {
                "suit": "clubs",
                "value": 5
            },
            {
                "suit": "clubs",
                "value": 6
            },
            {
                "suit": "clubs",
                "value": 7
            },
            {
                "suit": "clubs",
                "value": 8
            },
            {
                "suit": "clubs",
                "value": 9
            },
            {
                "suit": "clubs",
                "value": 10
            },
            {
                "suit": "clubs",
                "value": "J"
            },
            {
                "suit": "clubs",
                "value": "Q"
            },
            {
                "suit": "clubs",
                "value": "K"
            },
            {
                "suit": "clubs",
                "value": "A"
            },
            {
                "suit": "spades",
                "value": 2
            },
            {
                "suit": "spades",
                "value": 3
            },
            {
                "suit": "spades",
                "value": 4
            },
            {
                "suit": "spades",
                "value": 5
            },
            {
                "suit": "spades",
                "value": 6
            },
            {
                "suit": "spades",
                "value": 7
            },
            {
                "suit": "spades",
                "value": 8
            },
            {
                "suit": "spades",
                "value": 9
            },
            {
                "suit": "spades",
                "value": 10
            },
            {
                "suit": "spades",
                "value": "J"
            },
            {
                "suit": "spades",
                "value": "Q"
            },
            {
                "suit": "spades",
                "value": "K"
            },
            {
                "suit": "spades",
                "value": "A"
            }
        ]
    }
    return deck;
}

export function getDeck(deck_id, decks){
    for(let index of decks){
        //console.log(index.deck_id + " = id");
        if(deck_id == index.deck_id){
            //console.log(index.deck[3]);
            return index;
        }
    }
}

export function shuffleDeck(deck){
    //https://stackoverflow.com/questions/49555273/how-to-shuffle-an-array-of-objects-in-javascript
    function shuffleFisherYates(array) {
        let i = array.length;
        while (i--) {
          const ri = Math.floor(Math.random() * i);
          [array[i], array[ri]] = [array[ri], array[i]];
        }
        return array;
    }
    return shuffleFisherYates(deck.deck);
}

export function drawCard(deck){
   if(deck.deck.length > 0){
        const randomIndex = Math.floor(Math.random() * deck.deck.length);
        const card = deck.deck[randomIndex];
        deck.deck.splice(randomIndex,1);
        return card;
    }else{
        return "No more cards";
    }
}