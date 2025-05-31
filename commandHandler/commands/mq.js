import { Command } from "../commandConstructor.js";
import { getSocket, sendMessage } from "../../socket.js";
import { queryMemory } from "../../mongo/query.js";
import { uploadPaste } from "../../util.js";

async function callback(query, ...args){
    let result = await queryMemory(query)
    console.log(result, result.doc)
    // getSocket().emit('message', 'Query: '+ await uploadPaste(""+JSON.stringify(result)))
}

export const querymemory = new Command(
    "query",
    "query memory",
    [],
    ["query"],
    callback
);