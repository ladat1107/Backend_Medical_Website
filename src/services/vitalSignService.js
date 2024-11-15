import db from "../models/index";

const getVitalSignByExamId = async (examinationId) => {
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const createVitalSign = async (data) => {
    try {
        let vitalSign = await db.VitalSign.create({
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
        });
        return {
            EC: 0,
            EM: "Tạo sinh hiệu thành công",
            DT: vitalSign
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const updateVitalSign = async (data) => {
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
            where: { examinationId: data.examinationId }
        });
        return {
            EC: 0,
            EM: "Cập nhật sinh hiệu thành công",
            DT: vitalSign
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const deleteVitalSign = async (examinationId) => {
    try {
        let vitalSign = await db.VitalSign.destroy({
            where: { examinationId: examinationId }
        });
        return {
            EC: 0,
            EM: "Xóa sinh hiệu thành công",
            DT: vitalSign
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const createOrUpdateVitalSign = async (data) => {
    try {
        // Kiểm tra xem bản ghi đã tồn tại chưa
        const existingVitalSign = await db.VitalSign.findOne({
            where: { examinationId: data.examinationId }
        });

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
            });

            return {
                EC: 0,
                EM: "Cập nhật sinh hiệu thành công",
                DT: existingVitalSign
            };
        } else {
            // Tạo bản ghi mới nếu chưa tồn tại
            const newVitalSign = await db.VitalSign.create({
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
            });

            return {
                EC: 0,
                EM: "Tạo sinh hiệu thành công",
                DT: newVitalSign
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi từ server",
            DT: "",
        };
    }
}


module.exports = {
    getVitalSignByExamId,
    createVitalSign,
    updateVitalSign,
    deleteVitalSign,
    createOrUpdateVitalSign
}