import { createMessage, updateMessageStatus } from "../services/messageUserService";
import { STATUS_MESSAGE } from "../utils";

export default function socketController(io) {
    const chatNamespace = io.of("/chat");
    const typingUsers = new Map();
    chatNamespace.on("connection", (socket) => {

        socket.on("joinRoom", (conversationId) => {
            if (!conversationId) return;

            const roomName = `room-${conversationId}`;
            socket.join(roomName);

            // Acknowledge room joining
            socket.emit("roomJoined", {
                room: roomName,
                success: true,
                conversationId: conversationId
            });
        });

        socket.on("sendMessage", async (messageData) => {
            const { conversationId, userId, content, link } = messageData;
            if (!conversationId || !userId) {
                socket.emit("messageError", { error: "Missing required data" });
                return;
            }

            try {
                let response = await createMessage({
                    conversationId: conversationId,
                    senderId: userId,
                    content: content,
                    link: link,
                    status: STATUS_MESSAGE.SENT
                });

                // Send to everyone in the room including sender
                chatNamespace.to(`room-${conversationId}`).emit("receiveMessage", response);

                // Acknowledge message was sent successfully
                // socket.emit("messageSent", {
                //     success: true,
                //     messageId: response.DT.id
                // });

                socket.emit("messageStatus", {
                    EC: 0,
                    DT: {
                        id: tempMessageId,
                        status: STATUS_MESSAGE.SENT
                    }
                });
                // Gửi thông báo tin nhắn đã được nhận cho người nhận
                const receiverSocket = Array.from(chatNamespace.sockets.values())
                    .find(s => s.userId === response.DT.receiverId);

                if (receiverSocket) {
                    receiverSocket.emit("messageStatus", {
                        EC: 0,
                        EM: "Đã nhận tin nhắn",
                        DT: {
                            id: response.DT.id,
                            status: STATUS_MESSAGE.RECEIVED
                        }
                    });
                }

            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("messageError", { error: "Failed to send message" });
            }
        });
        socket.on("typing", (data) => {
            const { conversationId, isTyping } = data;
            if (!conversationId) return;

            const roomName = `room-${conversationId}`;
            const userId = socket.userId;

            if (isTyping) {
                typingUsers.set(userId, conversationId);
            } else {
                typingUsers.delete(userId);
            }

            chatNamespace.to(roomName).emit("typingStatus", {
                conversationId,
                isTyping: typingUsers.has(userId)
            });
        });
        socket.on("messageRead", async (data) => {
            const { conversationId, messageId } = data;
            if (!conversationId || !messageId) return;

            try {
                await updateMessageStatus(messageId, STATUS_MESSAGE.READ);
                chatNamespace.to(`room-${conversationId}`).emit("messageStatus", {
                    EC: 0,
                    EM: "Đã đọc tin nhắn",
                    DT: {
                        id: messageId,
                        status: STATUS_MESSAGE.READ
                    }
                });
            } catch (error) {
                console.error("Error updating message status:", error);
            }
        });
        socket.on("disconnect", () => {
            if (socket.userId) {
                typingUsers.delete(socket.userId);
            }
            console.log("User disconnected from chat namespace:", socket.id);
        });
    });
}