import db from "../models/index";

const getInsuaranceByUserId = async () => {
    try {
        let insuarance = await db.Insuarance.findOne({
            where: { userId: userId },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin bảo hiểm thành công",
            DT: insuarance
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const createInsuarance = async (data) => {
    try{
        let insuarance = await db.Insuarance.create({
            insuanceCode: data.insuanceCode,
            dateOfIssue: data.dateOfIssue,
            exp: data.exp,
            benefitLevel: data.benefitLevel,
            residentialCode: data.residentialCode,
            initialHealthcareRegistrationCode: data.initialHealthcareRegistrationCode,
            continuousFiveYearPeriod: data.continuousFiveYearPeriod,
            userId: data.userId
        });
        return {
            EC: 0,
            EM: "Tạo thông tin bảo hiểm thành công",
            DT: insuarance
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const updateInsuarance = async (data) => {
    try{
        let insuarance = await db.Insuarance.update({
            insuanceCode: data.insuanceCode,
            dateOfIssue: data.dateOfIssue,
            exp: data.exp,
            benefitLevel: data.benefitLevel,
            residentialCode: data.residentialCode,
            initialHealthcareRegistrationCode: data.initialHealthcareRegistrationCode,
            continuousFiveYearPeriod: data.continuousFiveYearPeriod,
        }, {
            where: {
                userId: data.userId
            }
        });
        return {
            EC: 0,
            EM: "Cập nhật thông tin bảo hiểm thành công",
            DT: insuarance
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const deleteInsuarance = async (userId) => {
    try{
        let insuarance = await db.Insuarance.destroy({
            where: {
                userId: userId
            }
        });
        return {
            EC: 0,
            EM: "Xóa thông tin bảo hiểm thành công",
            DT: insuarance
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

export default {
    getInsuaranceByUserId,
    createInsuarance,
    updateInsuarance,
    deleteInsuarance
}