import { io } from "socket.io-client";
import crypto from "crypto";

let socket;
const SIMILARITY_THRESHOLD = 0.8;

export function initSocket(token)
{
    socket = io("https://twoblade.com", {
        transports: ['websocket'],
        path: "/ws/socket.io/",
        auth: {
            token
        }
    });
    return socket;
}

var similar = { a: "\u0430", c: "\u0441", e: "\u0435", i: "\u0456", j: "\u0458", o: "\u043E", p: "\u0440", s: "\u0455", x: "\u0445", y: "\u0443", A: "\u0410", B: "\u0412", C: "\u0421", E: "\u0415", H: "\u041D", I: "\u0406", K: "\u039A", M: "\u041C", N: "\u039D", O: "\u041E", P: "\u0420", S: "\u0405", T: "\u0422", X: "\u0425", Y: "\u03A5", Z: "\u0396", "!": "\u01C3", ".": "\u2024", ";": "\u037E", ",": "\u201A", "-": "\u2010" };

function replace(text, similarMap) {
    return [...text].map(char => {
        const twin = similarMap[char];
        if (twin && Math.random() < 0.5) {
            return twin;
        }
        return char;
    }).join("");
}

export function sendMessage(...messages) {
    for (let original of messages) {
        let message = replace(original, similar);

        for (let i = 0; i < message.length; i += (500-33)) {
            let chunk = message.slice(i, i + (500-33));
            socket.emit("message", chunk +" "+crypto.randomUUID());
        }
    }
}

export function getSocket(){
    return socket;
}