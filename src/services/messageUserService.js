
import { Op } from "sequelize";
import db, { Sequelize } from "../models/index"
import { ERROR_SERVER, STATUS_MESSAGE } from "../utils";
let assistantForCustomer = [];

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
            let staffForConversation = assistantForCustomer.length
                ? assistantForCustomer.reduce((min, current) => current.count < min.count ? current : min)
                : null;

            conversation = await db.Conversation.create({
                patientId: receiverId || userId,
                staffId: receiverId ? userId : staffForConversation?.id || null,
                lastMessage: "",
            }, { transaction });

            if (staffForConversation) {
                assistantForCustomer = assistantForCustomer.map(assistant => {
                    if (assistant.id === staffForConversation.id) {
                        return { ...assistant, count: assistant.count + 1 };
                    }
                    return assistant;
                });
            }
        }

        if (!conversation.staffId || !assistantForCustomer.some(assistant => assistant.id === conversation.staffId)) {
            let staffForConversation = assistantForCustomer.length
                ? assistantForCustomer.reduce((min, current) => current.count < min.count ? current : min)
                : null;

            await conversation.update({
                staffId: receiverId ? userId : staffForConversation?.id || null
            }, { transaction });

            if (staffForConversation) {
                assistantForCustomer = assistantForCustomer.map(assistant => {
                    if (assistant.id === staffForConversation.id) {
                        return { ...assistant, count: assistant.count + 1 };
                    }
                    return assistant;
                });
            }
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
            where: {
                [Op.or]: [
                    { staffId: staffId },
                    { staffId: { [Op.is]: null } }
                ]
            },
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

        if (!assistantForCustomer.some(assistant => assistant?.id === staffId)) {
            assistantForCustomer.push({ id: staffId, count: conversation.length });
        }

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

export const deleteAssistantForCustomer = async (staffId) => {
    try {
        assistantForCustomer = assistantForCustomer.filter(assistant => assistant.id !== staffId);

        let staffForConversation = assistantForCustomer.length
            ? assistantForCustomer.reduce((min, current) => current.count < min.count ? current : min)
            : null;

        let [updatedCount] = await db.Conversation.update({
            staffId: staffForConversation?.id || null
        }, {
            where: { staffId: staffId }
        });

        if (staffForConversation) {
            assistantForCustomer = assistantForCustomer.map(assistant => {
                if (assistant.id === staffForConversation.id) {
                    return { ...assistant, count: assistant.count + updatedCount };
                }
                return assistant;
            });
        }

        return { EC: 0, EM: "Rời khỏi cuộc hội thoại thành công", DT: assistantForCustomer };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}

export const getNumberMessageUnread = async (userId) => {
    try {
        const numberMessageUnread = await db.Conversation.findOne({
            where: { patientId: userId },
            include: [
                {
                    model: db.Message,
                    as: "messageData",
                    where: { status: { [Op.ne]: STATUS_MESSAGE.READ }, senderId: { [Op.ne]: userId } }
                }
            ]
        })
        if (numberMessageUnread && numberMessageUnread.dataValues.messageData.length > 0) {
            return { EC: 0, EM: "Lấy số tin nhắn chưa đọc thành công", DT: numberMessageUnread.dataValues.messageData.length };
        } else {
            return { EC: 0, EM: "Không có tin nhắn chưa đọc", DT: 0 };
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}

export const searchConversation = async (keyword) => {
    try {
        const conversation = await db.Conversation.findAll({
            include: [
                {
                    model: db.User,
                    as: "patientData",
                    attributes: ["id", "lastName", "firstName", "avatar"],
                    where: {
                        [Op.or]: [
                            { lastName: { [Op.like]: `%${keyword}%` } },
                            { firstName: { [Op.like]: `%${keyword}%` } },
                            Sequelize.literal(`CONCAT(lastName, ' ', firstName) LIKE '%${keyword}%'`),
                            { email: { [Op.like]: `%${keyword}%` } },
                            { cid: { [Op.like]: `%${keyword}%` } }
                        ]
                    }
                }
            ],
            nest: true,
            order: [['updatedAt', 'DESC']],
        })
        return { EC: 0, EM: "Tìm kiếm cuộc hội thoại thành công", DT: conversation };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}

export const getConversationFromSearch = async (conversationId, userId) => {
    try {
        let conversation = await db.Conversation.findOne({
            where: { id: conversationId }
        })

        await conversation.update({ staffId: userId }, {
            where: { id: conversationId }
        })

        return { EC: 0, EM: "Thêm cuộc trò chuyện thành công", DT: conversation };

    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}
