import { getPaymentAdmin } from "../services/paymentService";
import { ERROR_SERVER } from "../utils";

export const getPaymentAdminController = async (req, res) => {
    try {
        let data = req.query;
        let result = await getPaymentAdmin(data);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
