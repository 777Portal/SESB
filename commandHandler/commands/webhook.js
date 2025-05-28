import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { sendWebhook } from "../../util.js";

async function callback(query){
    let res = await sendWebhook(query)
    console.log(res)
    sendMessage(`sent via webhook.`);
}

export const webhook = new Command(
    "webhook",
    "send to webhook",
    ["ws", "webh"],
    ["username"],
    callback,
    {webhook: {}}
);