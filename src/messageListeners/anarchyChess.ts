// trust me, this mess is actual real social interactions in reddit. This is the level r/anarchyChess has come to

import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "../MessageListener.js";

let responses = [
    "Are you kidding ??? What the ** are you talking about man ? You are a biggest looser i ever seen in my life ! You was doing PIPI in your pampers when i was beating players much more stronger then you! You are not proffesional, because proffesionals knew how to lose and congratulate opponents, you are like a girl crying after i beat you! Be brave, be honest to yourself and stop this trush talkings!!! Everybody know that i am very good blitz player, i can win anyone in the world in single game! And \"w\"esley \"s\"o is nobody for me, just a player who are crying every single time when loosing, ( remember what you say about Firouzja ) !!! Stop playing with my name, i deserve to have a good name during whole my chess carrier, I am Officially inviting you to OTB blitz match with the Prize fund! Both of us will invest 5000$ and winner takes it all!\nI suggest all other people who's intrested in this situation, just take a look at my results in 2016 and 2017 Blitz World championships, and that should be enough... No need to listen for every crying babe, Tigran Petrosyan is always play Fair ! And if someone will continue Officially talk about me like that, we will meet in Court! God bless with true! True will never die ! Liers will kicked off...",
    "Stop saying \"New response just dropped\" every time someone says something on this godforsaken sub, no, a new response did not drop, just an average mediocre statement that adds nothing more to a conversation, for the love of fucking god. if i see ONE more person mindlessly saying \"New response just dropped\" i'm going to chop my fucking pipi off. holy shit it is actually impressive how incredibly unfunny the entire sub is. it's not that complicated, REPEATING THE SAME FUCKING JOKE OVER AND OVER AGAIN DOES NOT MAKE IT FUNNIER. this stupid fucking meme has been milked to fucking death IT'S NOT FUNNIER THE 973RD TIME YOU MAKE THE EXACT SAME FUCKING JOKE. WHAT'S EVEN THE JOKE?????? IT'S JUST \"haha it's the funne nEw ReSpoNsE thingy\" STOP. and the WORST part is that new responses were actually funny for like a few years and it got fucking ruined in like a week because EVERYONE POSTED THE EXACT SAME FUCKING JOKE OVER AND OVER AGAIN. PLEASE MAKE IT STOP. SEEING ALL YOUR SHITTY MEMES IS ACTUAL FUCKING MENTAL TORTURE YOU ALL ARE NOT FUNNY. COME UP WITH A DIFFERENT FUCKING JOKE PLEASE...",
    "can someone explain what is the deal with these responses and why they have to be in that particular order? don't tell me to google anything or actual zombie pls",
    "the simple fact that i understand \"???\" is not for a to-be-declared reply, and this reply chain is often seen on different subreddits as well, amazes me",
    "i accidentally stabbed myself so i'm not in the mood for that right now",
    "idk man \"call the exorcist!\" is a bad response",
    "bishop goes on vacation, never comes back",
    "holy bishops on skateboards!",
    "new response just dropped",
    "quick, grab the popcorn!",
    "queen sacrifice, anyone?",
    "?? call the exorcist ??",
    "ignite the chessboard!",
    "new album just dropped",
    "??? call the exorcist!",
    "pawn storm incoming!",
    "call the exorcist!",
    "checkmate or riot!",
    "google il vaticano",
    "google en passant",
    "brainless parrots",
    "knightmare fuel",
    "actual footage",
    "actual zombie",
    "google search",
    "unholy heaven",
    "holy hell",
    "holy cow",
    "holy see",
    "pipi",
    "???"
];

let responseGraph = [
    [],
    [],
    [19, 23],
    [],
    [],
    [],
    [10, 15, 17, 19, 21],
    [],
    [1, 23],
    [21],
    [6, 15, 17, 19, 21],
    [10],
    [],
    [22],
    [],
    [6, 10, 17, 19, 21],
    [5, 7, 9, 12, 21, 30],
    [6, 10, 15, 19, 21],
    [25, 28],
    [4, 26],
    [],
    [6, 10, 15, 17, 19],
    [],
    [2, 11, 16, 20, 30],
    [27],
    [],
    [8],
    [13],
    [],
    [0],
    [3, 16, 21]
];

let peculiarSequence = ["??? call the exorcist!", "actual zombie", "new response just dropped", "holy hell", "google en passant"];
let peculiarSequenceIndex: number = -1;

const anarchyChess: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => !caller.isMe,
    listener: async (client, message) => {
        let lowerCaseMessage = message.body.toLowerCase();

        let index = responses.indexOf(lowerCaseMessage);
        if (index === -1) return;

        if (index === 14) {
            peculiarSequenceIndex = 0;
        }
        if (peculiarSequenceIndex !== -1) {
            if (lowerCaseMessage === peculiarSequence[peculiarSequenceIndex]) {
                let response = peculiarSequence[++peculiarSequenceIndex];
                if (response === undefined) {
                    peculiarSequenceIndex = -1;
                    return;
                }

                client.sendText(message.chatId, response);
                peculiarSequenceIndex++;
                return;
            } else {
                peculiarSequenceIndex = -1;
            }
        }

        let possibleResponses = responseGraph[index];
        let response = responses[possibleResponses[Math.floor(Math.random() * possibleResponses.length)]];

        client.sendText(message.chatId, response);
    },
    helpMessage: "Eu respondo automaticamente a uma mensagem da sequência anárquica"
};

export default anarchyChess;
