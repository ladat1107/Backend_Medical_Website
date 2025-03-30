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
    }
};

export const removeUserSocket = (userId) => {
    if (userId && userSocketMap.has(userId)) {
        userSocketMap.delete(userId);
    }
};

export const sendNotification = (io, title, htmlDescription, firstName, lastName, date, attachedFiles, recipients = []) => {
    // Kiểm tra io có tồn tại không
    if (!io) {
        console.error("IO không tồn tại!");
        return;
    }

    try {
        if (recipients && recipients.length > 0) {
            recipients.forEach(userId => {
                const userSocket = userSocketMap.get(userId);
                if (userSocket) {
                    const notificationData = { title, htmlDescription, firstName, lastName, date, attachedFiles };
                    userSocket.emit('notification', notificationData);
                }
            });
        } else {
            const notificationData = { title, htmlDescription, firstName, lastName, date };
            io.emit('notification', notificationData);
        }
    } catch (error) {
        console.error("Lỗi trong sendNotification:", error);
    }
};

