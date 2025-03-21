import { messageService } from "../services/messageService";
import { ERROR_SERVER } from "../utils";

export const messageSystem = async (req, res) => {
    try {
        const { message } = req.body;
        let response = await messageService(message);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}