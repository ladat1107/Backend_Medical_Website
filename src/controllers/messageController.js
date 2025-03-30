import { messageAIService } from "../services/messageAIService";
import { getConversation, getConversationForStaff } from "../services/messageUserService";
import { ERROR_SERVER } from "../utils";

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
