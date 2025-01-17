
export function randomQuote() {
    const quotes = [
        "I think, therefor I am",
        "I have no mouth and I must scream",
        "Som Shakespear engang sa: Ja",
        "Bedre med ett høns i låven enn to på taket",
        "If at first you don't succseed; Then skydiving is probably not for you",
        "The sooner you fall behind, the more time you have to catch up",
        "Stay alive and maybe something will happen",
    ];
    const randomNumber = Math.floor(Math.random() * quotes.length);
    return quotes[randomNumber];
}
