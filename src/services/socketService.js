import db from "../models";
import { SOCKET } from "../utils";

export const emitNewDateTicket = async (io) => {
    const today = new Date().toISOString().split("T")[0];

    const latestTicket = await db.Ticket.findOne({
        where: { createdAt: today },
    });
    if (!latestTicket) {
        await db.Ticket.update({
            createdAt: today,
            normalNumber: 1,
            priorityNumber: 1,
            normalNumberCurrent: 1,
            priorityNumberCurrent: 1,
        }, {
            where: { id: 1 },
        });
        io.emit(SOCKET.EMIT_UPDATE_TICKET_NEW_DAY);
    }
};

// services/socketService.js
export const NotificationType = {
    DEFAULT: 'default',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
};
  
const userSocketMap = new Map();

export const registerUserSocket = (socket, userId) => {
if (userId) {
    userSocketMap.set(userId, socket);
    console.log(`User ${userId} connected with socket ${socket.id}`);
}};

export const removeUserSocket = (userId) => {
if (userId && userSocketMap.has(userId)) {
    userSocketMap.delete(userId);
    console.log(`User ${userId} disconnected`);
}};

export const sendNotification = (io, message, type = NotificationType.DEFAULT, recipients = []) => {
if (recipients && recipients.length > 0) {
    recipients.forEach(userId => {
        const userSocket = userSocketMap.get(userId);
        if (userSocket) {
            userSocket.emit('notification', { message, type });
            console.log(`Notification sent to user ${userId}`);
        } else {
            console.log(`User ${userId} is not connected`);
        }
    });
} else {
    io.emit('notification', { message, type });
    console.log('Notification sent to all users');
}};

