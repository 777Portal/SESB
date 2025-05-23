import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getRevision, getCurrentRevision } from "../../util.js";
function helpCallback(){
    getSocket()?.emit("message", `SESB REV.${getRevision()} | current commands:  =help, =users, =messagecount, =topm, =search [bing search query], =messages [username], =message [username] [index], =quote [username], =firstseen [username], =lastseen [username]`)
}

export const help = new Command(
    "help",
    "lists available commands",
    ["h"],
    [],
    helpCallback
);