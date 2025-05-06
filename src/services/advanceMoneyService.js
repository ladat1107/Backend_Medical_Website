import db from "../models";
import { ERROR_SERVER, paymentStatus } from "../utils";


export const createAdvanceMoney = async (data) => {
    try{
        const advanceMoney = await db.AdvanceMoney.create({
            exam_id: data.examId,
            amount: data.amount,
            date: new Date(),
            status: paymentStatus.PENDING,
        });
        
        return {
            EC: 0,
            EM: "Thêm tạm ứng thành công",
            DT: advanceMoney
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}