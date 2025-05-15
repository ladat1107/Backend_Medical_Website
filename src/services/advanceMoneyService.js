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

export const updateAdvanceMomo = async (data, payment) => {
    let transaction = await db.sequelize.transaction();
    try {
        let dataUpdate = data.update;

        // let dataUpdate = data.update;
        // await db.Examination.update({
        //     insuranceCoverage: dataUpdate?.insuranceCoverage || null,
        //     insuranceCode: dataUpdate?.insuranceCode || null,
        //     insuranceCovered: dataUpdate?.insuranceCovered || null,
        //     coveredPrice: dataUpdate?.coveredPrice || null,
        //     status: dataUpdate?.status,
        //     paymentId: payment.id,
        // }, {
        //     where: { id: data.id }
        // });
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
