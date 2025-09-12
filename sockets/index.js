// sockets/index.js
import ticketSocketHandlers from './ticketSocket.js';
// Import other handlers here if you have them, e.g., notificationSocketHandlers

export const socketHandler = (io, socket) => {
    console.log(`⚡ Socket handler initialized for ${socket.id}`);

    // Call handlers for each feature module
    ticketSocketHandlers(io, socket);
    // e.g., notificationSocketHandlers(io, socket);
};