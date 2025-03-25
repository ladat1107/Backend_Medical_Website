import { messageAIService } from "../services/messageAIService";
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
         
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}