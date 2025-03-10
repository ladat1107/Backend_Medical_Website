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

export const sendNotification = (io, message, type = 'default') => {
    io.emit("receiveNotification", { 
      message, 
      type,
      timestamp: new Date().toISOString()
    });
  };

