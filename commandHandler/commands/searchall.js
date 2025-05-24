import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 
import { isSimilar, topNClosest } from "../../util.js";

function callback(...args){
    let input = args[args.length - 1]?.text ?? "";
    let query = input.substring(input.indexOf(" ") + 1);
    
    let users = Object.values(getUsers());
    let messages = []

    for (let user of users){
        if ( Object.keys(user.messages).length == 0 ) continue;

        for (let messageId in user.messages) {
            messages.push(user.messages[messageId])
        };
    }
    const results = topNClosest(query, messages, 5);

    let str = '';
    for (let { item, dist } of results) {
      console.log(item);
      str += `[ ${item.text} - ${item.fromUser} (dist: ${dist}) ]\n `;
    }
    
    getSocket()?.emit("message", `${query} \n${str}`);    
}

export const searchall = new Command(
    "searchall",
    "searchAll",
    ["sa", "searcha"],
    [true],
    callback,
    {search: {}}
);