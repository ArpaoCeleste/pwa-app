import { io } from "socket.io-client";

const socket = io();

export const initSocket = () => {
    console.log("Inicializando socket...");

    if(socket.connected) {
        console.log("Estou conectado");
    } else {
        console.log("Tentando conectar...");
    }

    socket.on('connect', () => {
        console.log("Conectado ao servidor:", socket.id);
    });

    socket.on('disconnect', () => {
        console.log("Desconectado do servidor");
    });

    return socket;
};

export const socketAddListener = (listener = "", callback = () => {}) => {
    socket.on(listener, callback);
}

export const socketRemoveListener = (listener = "", callback = () => {}) => {
    socket.off(listener, callback);
}