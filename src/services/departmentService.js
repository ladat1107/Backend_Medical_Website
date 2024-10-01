import db from "../models/index";
import { status } from "../utils/index";
import descriptionService from "./descriptionService";

const getAllDepartment = async () => {
    try {
        let department = await db.Department.findAll({
            where: { status: status.ACTIVE },
            include: [{
                model: db.Staff,
                as: 'deanDepartmentData',
                attributes: ['id', 'position'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['firstName', 'lastName', 'email', 'avatar'],
                }]
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin phòng ban thành công",
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
const getDepartmentById = async (departmentId) => {
    try {
        let department = await db.Department.findOne({
            where: { id: departmentId, status: status.ACTIVE },
            include: [{
                model: db.Description,
                as: 'departmentDescriptionData',
                attributes: ['markDownContent', 'htmlContent'],
                where: { status: status.ACTIVE },
            },{
                model: db.Staff,
                as: 'deanDepartmentData',
                attributes: ['id', 'position'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['firstName', 'lastName', 'email', 'avatar'],
                }]
            }],
            raw: true,
            nest: true,
        });
        if (department) {
            return {
                EC: 0,
                EM: "Lấy thông tin phòng ban thành công",
                DT: department
            }
        }
        return {
            EC: 404,
            EM: "Không tìm thấy phòng ban",
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

const getAllStaffInDepartment = async (departmentId) => {
    try{
        let department = await db.Department.findOne({
            where: { id: departmentId, status: status.ACTIVE },
            include: [{
                model: db.Staff,
                as: 'staffDepartmentData',
                attributes:['id', 'position', 'price'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['id', 'lastName', 'firstName', 'email', 'dob', 'phoneNumber', 'avatar','roleId'],
                    where: { status: status.ACTIVE },
                }],
                where: { status: status.ACTIVE },
            }],
        });
        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên trong phòng ban thành công",
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

const createDepartment = async (data) => {
    try {
        let descriptionId = await descriptionService.createDescription(data);
        if(descriptionId){
            let department = await db.Department.create({
                name: data.name,
                image: data.image,
                deanId: data.deanId,
                status: status.ACTIVE,
                descriptionId: descriptionId,
                address: data.address
            });
            return {
                EC: 0,
                EM: "Tạo phòng ban thành công",
                DT: department
            }
        } else{
            await descriptionService.deleteDescription(descriptionId);
            return {
                EC: 500,
                EM: "Tạo phòng ban thất bại",
                DT: "",
            }
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
const updateDepartment = async (data) => {
    try {
        let department = await db.Department.findOne({
            where: { id: data.id },
        }); 
        if (department) {
            let description = await descriptionService.updateDescription(data, department.descriptionId);
            if (description) {
                await department.update({
                    name: data.name,
                    image: data.image,
                    deanId: data.deanId,
                    address: data.address
                });
                return {
                    EC: 0,
                    EM: "Cập nhật phòng ban thành công",
                    DT: department
                }   
            } else{
                return {
                    EC: 500,
                    EM: "Cập nhật phòng ban thất bại",
                    DT: "",
                }
            }
        } else {
            return {
                EC: 404,
                EM: "Không tìm thấy phòng ban",
                DT: "",
            }
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

const deleteDepartment = async (departmentId) => {
    try {
        let department = await db.Department.findOne({
            where: { id: departmentId },
        });
        if (department) {
            let description = await descriptionService.updateStatusDescription(department.descriptionId);
            if (description) {
                await department.update({
                    status: status.INACTIVE,
                });
                return {
                    EC: 0,
                    EM: "Xóa phòng ban thành công",
                    DT: department
                }
            }else{
                return {
                    EC: 500,
                    EM: "Xóa phòng ban thất bại",
                    DT: "",
                }
            }
        }
        return {
            EC: 404,
            EM: "Không tìm thấy phòng ban",
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

module.exports = {
    getAllDepartment,
    getDepartmentById,
    getAllStaffInDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
}