import db from "../models";
import { ERROR_SERVER, paymentStatus } from "../utils";


export const createAdvanceMoney = async (data) => {
    try {
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

export const deleteAdvanceMoney = async (id) => {
    try {
        const advanceMoney = await db.AdvanceMoney.findOne({
            where: { id: id }
        });

        if (!advanceMoney) {
            return {
                EC: 1,
                EM: "Không tìm thấy tạm ứng",
                DT: {}
            }
        }

        if (advanceMoney.status === paymentStatus.PAID) {
            return {
                EC: 1,
                EM: "Không thể xóa tạm ứng đã thanh toán",
                DT: {}
            }
        }

        await db.AdvanceMoney.destroy({
            where: { id: id }
        });

        return {
            EC: 0,
            EM: "Xóa tạm ứng thành công",
            DT: advanceMoney
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const updateAdvanceMomo = async (data, payment) => {
    let transaction = await db.sequelize.transaction();
    try {
        let dataUpdate = data.update;

        await db.AdvanceMoney.update({
            status: paymentStatus.PAID,
            amount: dataUpdate?.advanceMoney,
            paymentId: payment.id
        }, {
            where: { id: data.id },
            transaction
        });
        await db.Examination.update({
            status: dataUpdate?.status,
        }, {
            where: { id: dataUpdate.id },
            transaction
        });
        await transaction.commit();
        return true;
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return false;
    }
}
