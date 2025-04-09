import { messageAIService } from "../services/messageAIService";
import { createMessage, deleteAssistantForCustomer, getConversation, getConversationForStaff } from "../services/messageUserService";
import { ERROR_SERVER, ROLE, STATUS_MESSAGE } from "../utils";

export const messageSystem = async (req, res) => {
    try {
        const { message, history } = req.body;
        let response = await messageAIService(message, history);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const upsertConversationController = async (req, res) => {
    try {
        let { receiverId } = req.query;
        let userId = req.user.id;
        let isStaff = req.user.roleId === ROLE.RECEPTIONIST;

        if (isStaff && !receiverId) {
            return res.status(200).json({ EC: 0, EM: "Không tìm thấy người nhận", DT: null });
        }

        let response = await getConversation(userId, receiverId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const getConversationForStaffController = async (req, res) => {
    try {
        let staffId = req.user.id;
        let response = await getConversationForStaff(staffId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const deleteAssistantForCustomerController = async (req, res) => {
    try {
        let staffId = req.user.id;
        let response = await deleteAssistantForCustomer(staffId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}


export const createMessageController = async (req, res) => {
    try {
        const { conversationId, senderId, content, link, createdAt } = req.body;
        const message = await createMessage({ conversationId, senderId, content, link, createdAt, status: STATUS_MESSAGE.SENT });
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ERROR_SERVER });
    }
}

