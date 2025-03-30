
import db from "../models/index"
import { ERROR_SERVER, STATUS_MESSAGE } from "../utils";
let assistantForCustomer = [{ id: 170 }, { id: 171 }, { id: 172 }];

export const getConversation = async (userId, receiverId) => {
    try {
        let conversation = await db.Conversation.findOne({
            where: {
                patientId: receiverId ? receiverId : userId,
            },
            include: [{
                model: db.Message,
                as: "messageData",
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
        })
        if (!conversation) {
            let staffForConversation = assistantForCustomer[Math.floor(Math.random() * assistantForCustomer.length)];
            conversation = await db.Conversation.create({
                patientId: receiverId ? receiverId : userId,
                staffId: receiverId ? userId : staffForConversation?.id || null,
                lastMessage: "",
            })
        }
        if (!conversation.staffId || !assistantForCustomer.some(assistant => assistant.id === conversation.staffId)) {
            let staffForConversation = assistantForCustomer[Math.floor(Math.random() * assistantForCustomer.length)];
            await conversation.update({
                staffId: staffForConversation?.id || null
            })
        }
        return { EC: 0, EM: "Thành công", DT: conversation };
    } catch (error) {
        console.log(error);
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
                }
            ],
            order: [
                ['updatedAt', 'DESC']
            ],
            raw: true,
            nest: true,
        })
        return { EC: 0, EM: "Thành công", DT: conversation };
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
            return { EC: 0, EM: "Thành công", DT: message };
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


