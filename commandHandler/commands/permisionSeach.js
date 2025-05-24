import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(permissionName){    
    getSocket()?.emit("searching for "+ permissionName);

    let users = getUsers();
    const usersWithPermission = Object.entries(users)
        .filter(([_, user]) => user.permissions?.[permissionName])
        .map(([username]) => username);

    if (usersWithPermission.length == 0) return getSocket()?.emit("0 users have the permision" + permissionName);
    return getSocket()?.emit("message", ""+usersWithPermission.length+" users have the \'"+permissionName+"\' permision. [ "+usersWithPermission.toString() + " ]");
}

export const permisionSearch = new Command(
    "permisionsearch",
    "lists a user's permisions.",
    ["ps", "psearch", "permisionse"],
    ["permisionName"],
    callback
);