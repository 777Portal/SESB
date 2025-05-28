import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { sendWebhook } from "../../util.js";

async function callback(b, u, m){
    let res = await sendWebhook(b, u, m)
    console.log(res)
    sendMessage(`sent via webhook.`);
}

export const webhook = new Command(
    "webhook",
    "send to webhook",
    ["wh", "webh"],
    ["b", "u", "m"],
    callback,
    {webhook: {}}
);