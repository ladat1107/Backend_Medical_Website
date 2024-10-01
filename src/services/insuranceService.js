import db from "../models/index";

const getInsuranceById = async (id) => {
    try {
        let insuarance = await db.Insurance.findOne({
            where: { id: id },
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

const getInsuranceByUserId = async (userId) => {
    try {
        let insuarance = await db.Insurance.findOne({
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

const createInsurance = async (data) => {
    try{
        let insuarance = await db.Insurance.create({
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

const updateInsurance = async (data) => {
    try{
        let insuarance = await db.Insurance.update({
            insuanceCode: data.insuanceCode,
            dateOfIssue: data.dateOfIssue,
            exp: data.exp,
            benefitLevel: data.benefitLevel,
            residentialCode: data.residentialCode,
            initialHealthcareRegistrationCode: data.initialHealthcareRegistrationCode,
            continuousFiveYearPeriod: data.continuousFiveYearPeriod,
        }, {
            where: {
                id: data.id
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

const deleteInsurance = async (id) => {
    try{
        let insuarance = await db.Insurance.destroy({
            where: {
                id: id
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
    getInsuranceById,
    getInsuranceByUserId,
    createInsurance,
    updateInsurance,
    deleteInsurance
}