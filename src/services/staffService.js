import db from "../models/index";
import { status } from "../utils/index";
import descriptionService from "./descriptionService";

const getAllStaff = async () => {
    try {
        let staff = await db.Staff.findAll({
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên thành công",
            DT: department
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
const getStaffbyDepartmentId = async (departmentId) => {
    try {
        let staffs = await db.Staff.findAll({
            where: { id: departmentId },
            raw: true,
            nest: true,
        });
        if (staffs) {
            return {
                EC: 0,
                EM: "Lấy thông tin nhân viên trong khoa thành công",
                DT: department
            }
        }
        return {
            EC: 404,
            EM: "Không tìm thấy nhân viên",
            DT: "",
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
const getStaffById = async (staffId) => {
    try {
        let staff = await db.Staff.findOne({
            where: { id: staffId },
            include: [{
                model: db.Description,
                as: 'staffDescriptionData',
                attributes: ['markDownContent', 'htmlContent'],
                where: { status: status.ACTIVE },
            }],
            raw: true,
            nest: true,
        });
        if (staff) {
            return {
                EC: 0,
                EM: "Lấy thông tin nhân viên thành công",
                DT: department
            }
        }
        return {
            EC: 404,
            EM: "Không tìm thấy nhân viên",
            DT: "",
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
const createStaff = async (data, userId) => {
    try {
        let descriptionId = await descriptionService.createDescription(data);
        if(descriptionId){
            await db.Staff.create({
                price: data.price,
                position: data.position,
                departmentId: data.departmentId,
                status: status.ACTIVE,
                descriptionId: descriptionId,
                userId: userId
            });
            return true;
        }else{
            await descriptionService.deleteDescription(descriptionId);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}
const updateStaff = async (data) => {
    try {
        let staff = await db.Staff.findOne({
            where: { userId: data.id }
        });
        if (staff) {
            let description = await descriptionService.updateDescription(data, staff.descriptionId);
            if(description){
                await staff.update({
                    price: data.price,
                    position: data.position,
                    departmentId: data.departmentId,
                });
                return true
            }else{
                return false;
            }
        }
        else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    getAllStaff,
    getStaffbyDepartmentId,
    getStaffById,
    createStaff,
    updateStaff
}