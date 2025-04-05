
import { Op } from "sequelize";
import db from "../models/index"
import { ERROR_SERVER, STATUS_MESSAGE } from "../utils";
let assistantForCustomer = [{ id: 170 }, { id: 171 }, { id: 172 }];

export const getConversation = async (userId, receiverId) => {
    let transaction = await db.sequelize.transaction();
    try {
        let conversation = await db.Conversation.findOne({
            where: {
                patientId: receiverId || userId,
            },
            include: [{
                model: db.Message,
                as: "messageData",
                required: false, // Đảm bảo vẫn lấy cuộc hội thoại ngay cả khi chưa có tin nhắn
                order: [["createdAt", "ASC"]],
            },
            {
                model: db.User,
                as: "patientData",
                attributes: ["id", "lastName", "firstName", "avatar"]
            },
            {
                model: db.User,
                as: "staffData",
                attributes: ["id", "lastName", "firstName", "avatar"]
            }
            ],
        }, { transaction });
        if (!conversation) {
            let staffForConversation = assistantForCustomer[Math.floor(Math.random() * assistantForCustomer.length)];
            conversation = await db.Conversation.create({
                patientId: receiverId || userId,
                staffId: receiverId ? userId : staffForConversation?.id || null,
                lastMessage: "",
            }, { transaction });
        }
        if (!conversation.staffId || !assistantForCustomer.some(assistant => assistant.id === conversation.staffId)) {
            let staffForConversation = assistantForCustomer[Math.floor(Math.random() * assistantForCustomer.length)];
            await conversation.update({
                staffId: staffForConversation?.id || null
            }, { transaction });
        }

        const [_, updatedMessages] = await db.Message.update({ status: STATUS_MESSAGE.READ }, {
            where: {
                conversationId: conversation.id,
                senderId: { [Op.ne]: userId },
                status: { [Op.ne]: STATUS_MESSAGE.READ }
            },
            returning: true,
        }, { transaction });

        if (updatedMessages.length > 0) {
            const updatedMessageIds = new Set(updatedMessages.map(msg => msg.id)); // Set để tìm nhanh hơn

            for (let msg of conversation.dataValues.messageData) {
                if (updatedMessageIds.has(msg.id)) {
                    msg.status = STATUS_MESSAGE.READ; // Cập nhật status của messageData
                }
            }
        }
        await transaction.commit();
        return { EC: 0, EM: "Lấy cuộc hội thoại thành công", DT: conversation };
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return ERROR_SERVER;
    }
}
export const getConversationForStaff = async (staffId) => {
    try {
        let conversation = await db.Conversation.findAll({
            where: { staffId: staffId },
            include: [
                {
                    model: db.User,
                    as: "patientData",
                    attributes: ["id", "lastName", "firstName", "avatar"]
                },
                {
                    model: db.Message,
                    as: "messageData",
                    where: {
                        status: { [Op.ne]: STATUS_MESSAGE.READ },
                        senderId: { [Op.ne]: staffId }
                    },
                    required: false,
                    order: [['createdAt', 'DESC']],
                }
            ],
            order: [
                ['updatedAt', 'DESC']
            ],
            nest: true,
        })
        return { EC: 0, EM: "Nhân viên lấy cuộc hội thoại thành công", DT: conversation };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}
export const createMessage = async (data) => {
    let transaction = await db.sequelize.transaction();
    try {
        await db.Conversation.update({
            lastMessage: data.content,
        }, {
            where: { id: data.conversationId },
        }, { transaction });

        let message = await db.Message.create(data, { transaction })

        if (message) {
            await transaction.commit();
            return { EC: 0, EM: "Gửi tin nhắn thành công", DT: message };
        } else {
            await transaction.rollback();
            return ERROR_SERVER;
        }
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return ERROR_SERVER;
    }
}
export const updateMessageStatus = async (messageId, status) => {
    try {
        await db.Message.update({ status }, { where: { id: messageId } });
    } catch (error) {
        console.log(error);
    }
}
export const getUnreadMessages = async (conversationId, userId) => {
    try {
        //Lấy tin nhắn chưa đọc của senderId khác userId và status khác READ
        const unreadMessages = await db.Message.findAll({ where: { conversationId, status: { [Op.ne]: STATUS_MESSAGE.READ }, senderId: { [Op.ne]: userId } }, raw: true, nest: true });
        return { EC: 0, EM: "Lấy tin nhắn chưa đọc thành công", DT: unreadMessages };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}
export const getConversationById = async (conversationId) => {
    try {
        const conversation = await db.Conversation.findOne({
            where: { id: conversationId },
            include: [
                {
                    model: db.User,
                    as: "patientData",
                    attributes: ["id", "lastName", "firstName", "avatar"]
                },
                {
                    model: db.Message,
                    as: "messageData",
                    where: { status: { [Op.ne]: STATUS_MESSAGE.READ } },
                    required: false,
                    order: [['createdAt', 'DESC']],
                },
            ]
        });
        return { EC: 0, EM: "Lấy cuộc hội thoại theo id thành công", DT: conversation };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}
