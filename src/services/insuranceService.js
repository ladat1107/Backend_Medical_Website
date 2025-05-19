import db from "../models/index";
import { ERROR_SERVER } from "../utils";

export const getInsuranceById = async (id) => {
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
        return ERROR_SERVER
    }
}

export const getInsuranceByUserId = async (userId) => {
    try {
        let insuarance = await db.Insurance.findOne({
            where: { userId: userId },
            include: [{
                model: db.User,
                as: 'insuranceUserData',
                attributes: ['id', 'firstName', 'lastName', 'email'],
            }],
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
        return ERROR_SERVER
    }
}

export const createInsurance = async (data) => {
    try {
        let insuarance = await db.Insurance.create({
            insuranceCode: data?.insuranceCode || null,
            dateOfIssue: data?.dateOfIssue || null,
            exp: data?.exp || null,
            benefitLevel: data?.benefitLevel || null,
            residentialCode: data?.residentialCode || null,
            initialHealthcareRegistrationCode: data?.initialHealthcareRegistrationCode || null,
            continuousFiveYearPeriod: data?.continuousFiveYearPeriod || null,
            userId: data?.userId || null
        });
        return {
            EC: 0,
            EM: "Tạo thông tin bảo hiểm thành công",
            DT: insuarance
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateInsurance = async (data) => {
    try {
        let insuarance = await db.Insurance.update({
            insuranceCode: data.insuranceCode,
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
        return ERROR_SERVER
    }
}

export const deleteInsurance = async (id) => {
    try {
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
        return ERROR_SERVER
    }
}




