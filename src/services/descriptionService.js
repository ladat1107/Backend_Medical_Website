import db from "../models/index";
import { status } from "../utils/index";

const getDesciptionById = async (descriptionId) => {
    try {
        let description = await db.Description.findOne({
            where: { id: descriptionId },
            raw: true,
            nest: true,
        });
        if (description) {
            return {
                EC: 0,
                EM: "Lấy thông tin mô tả thành công",
                DT: description
            }
        }
        return {
            EC: 404,
            EM: "Không tìm thấy mô tả",
            DT: "",
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

const createDescription = async (data) => {
    try {
        let description = await db.Description.create({
            markDownContent: data.markDownContent,
            htmlContent: data.htmlContent,
            status: status.ACTIVE,
        });
        return description.id;
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const updateDescription = async (data, descriptionId) => {
    try {
        let description = await db.Description.findOne({
            where: { id: descriptionId },
        });
        if (description) {
            await description.update({
                markDownContent: data.markDownContent,
                htmlContent: data.htmlContent,
                status: status.ACTIVE,
            });
            return description;
        } else {
            let newDescription = await db.Description.create({
                markDownContent: data.markDownContent,
                htmlContent: data.htmlContent,
                status: status.ACTIVE,
            });
            return newDescription;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

const updateStatusDescription = async (descriptionId) => {
    try {
        let description = await db.Description.findOne({
            where: { id: descriptionId }
        });
        if (description) {
            await description.update({
                status: status.INACTIVE,
            }, {
                where: { id: descriptionId }
            });
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

const deleteDescription = async (descriptionId) => {
    try {
        await db.Description.destroy(descriptionId);
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

module.exports = {
    getDesciptionById,
    createDescription,
    updateDescription,
    updateStatusDescription,
    deleteDescription,

}