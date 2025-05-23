import { io } from "socket.io-client";

let socket;
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

export function getSocket(){
    return socket;
}