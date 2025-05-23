import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getRevision, getCurrentRevision, getGitLogByHash } from "../../util.js";
import { formatTimeSince } from "../../util.js";

let bootTime = new Date();

function callback(){
    let status = getRevision() == getCurrentRevision() ? '' : ` (OUTDATED - CURRENT: ${getCurrentRevision()})`;
    getSocket()?.emit("message", `SESB REV.${getRevision()} - ${getGitLogByHash(getRevision())} | ${status} Uptime: ${formatTimeSince(bootTime.toString())}`)
}

export const debug = new Command(
    "debug",
    "debug",
    ["?", "~", "!"],
    [],
    callback
);