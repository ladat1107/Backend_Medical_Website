import { createAdvanceMoney, deleteAdvanceMoney } from "../services/advanceMoneyService";
import { ERROR_SERVER } from "../utils";

export const createAdvanceMoneyController = async (req, res) => {
    try {
        const data = req.body;
        const response = await createAdvanceMoney(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const deleteAdvanceMoneyController = async (req, res) => {
    try {
        const id = req.query.id;
        const response = await deleteAdvanceMoney(id);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}