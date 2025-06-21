import db from "../models/index";
import { ERROR_SERVER, status } from "../utils";

export const getVitalSignByExamId = async (examinationId) => {
    try {
        let vitalSigns = await db.VitalSign.findOne({
            where: {
                examinationId: examinationId
            }
        });
        return {
            EC: 0,
            EM: "Lấy thông tin sinh hiệu thành công",
            DT: vitalSigns
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createVitalSign = async (data) => {
    const transaction = await db.sequelize.transaction();

    try {
        let examination = await db.Examination.findOne({
            where: {
                id: data.examinationId
            },
            transaction // Pass transaction to the query
        });

        if (!examination) {
            await transaction.rollback(); // Rollback if examination not found
            return {
                EC: 404,
                EM: "Không tìm thấy phiên khám",
                DT: ""
            }
        }

        let vitalSign = await db.VitalSign.create({
            examinationId: data.examinationId,
            height: data.height,
            weight: data.weight,
            fetalWeight: data.fetalWeight || null,
            pulse: data.pulse,
            temperature: data.temperature,
            hightBloodPressure: data.hightBloodPressure,
            lowBloodPressure: data.lowBloodPressure,
            breathingRate: data.breathingRate,
            glycemicIndex: data.glycemicIndex || null,
        }, { transaction });

        await examination.update({
            status: status.EXAMINING,
        }, { transaction });

        await transaction.commit(); // Commit the transaction
        return {
            EC: 0,
            EM: "Tạo sinh hiệu thành công",
            DT: vitalSign
        }
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateVitalSign = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {
        let vitalSign = await db.VitalSign.update({
            height: data.height,
            weight: data.weight,
            fetalWeight: data.fetalWeight,
            pulse: data.pulse,
            temperature: data.temperature,
            hightBloodPressure: data.hightBloodPressure,
            lowBloodPressure: data.lowBloodPressure,
            breathingRate: data.breathingRate,
            glycemicIndex: data.glycemicIndex,
        }, {
            where: { id: data.id },
            transaction 
        });

        await db.Examination.update({
            status: status.EXAMINING,
        }, {
            where: { id: data.examinationId },
            transaction
        });

        await transaction.commit(); // Commit the transaction
        return {
            EC: 0,
            EM: "Cập nhật sinh hiệu thành công",
            DT: vitalSign
        }
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction in case of error
        console.log(error);
        return ERROR_SERVER
    }
}

export const deleteVitalSign = async (id) => {
    try {
        let vitalSign = await db.VitalSign.destroy({
            where: { id: id }
        });
        return {
            EC: 0,
            EM: "Xóa sinh hiệu thành công",
            DT: vitalSign
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createOrUpdateVitalSign = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {
        // Kiểm tra xem bản ghi đã tồn tại chưa
        const existingVitalSign = await db.VitalSign.findOne({
            where: { examinationId: data.examinationId },
            transaction
        });

        let newVitalSign;
        if (existingVitalSign) {
            // Cập nhật bản ghi nếu đã tồn tại
            await existingVitalSign.update({
                height: data.height,
                weight: data.weight,
                fetalWeight: data.fetalWeight,
                pulse: data.pulse,
                temperature: data.temperature,
                hightBloodPressure: data.hightBloodPressure,
                lowBloodPressure: data.lowBloodPressure,
                breathingRate: data.breathingRate,
                glycemicIndex: data.glycemicIndex,
            }, { transaction });

        } else {
            // Tạo bản ghi mới nếu chưa tồn tại
            newVitalSign = await db.VitalSign.create({
                examinationId: data.examinationId,
                height: data.height,
                weight: data.weight,
                fetalWeight: data.fetalWeight,
                pulse: data.pulse,
                temperature: data.temperature,
                hightBloodPressure: data.hightBloodPressure,
                lowBloodPressure: data.lowBloodPressure,
                breathingRate: data.breathingRate,
                glycemicIndex: data.glycemicIndex,
            }, { transaction });
        }

        await db.Examination.update({
            status: status.EXAMINING,
        }, {
            where: { id: data.examinationId },
            transaction
        });

        await transaction.commit(); // Commit the transaction
        return {
            EC: 0,
            EM: "Cập nhật sinh hiệu thành công",
            DT: existingVitalSign ? existingVitalSign : newVitalSign
        };
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction in case of error
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi từ server",
            DT: "",
        };
    }
}
