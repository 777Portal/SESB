import { Command } from "../commandConstructor.js";
import { sendMessage, getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 
import { uploadPaste } from "../../util.js";

async function callback(permissionName){    
    let users = getUsers();
    const usersWithPermission = Object.entries(users)
        .filter(([_, user]) => user.permissions?.[permissionName])
        .map(([username]) => username);

    if (usersWithPermission.length == 0) return sendMessage("0 users have the permision" + permissionName);
    let link = await uploadPaste(usersWithPermission.toString());
    return getSocket().emit("message", ""+usersWithPermission.length+" users have the \'"+permissionName+"\' permision.\n Link: "+link);
}

export const permisionSearch = new Command(
    "permisionsearch",
    "lists a user's permisions.",
    ["ps", "psearch", "permisionse"],
    ["permisionName"],
    callback
);