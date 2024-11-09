import { Op } from "sequelize";
import db from "../models/index";
import { status } from "../utils/index";
import descriptionService from "./descriptionService";

const getAllDepartment = async (page, limit, search) => {
    try {
        let department = await db.Department.findAndCountAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } },
                ]
            },
            include: [
                {
                    model: db.Staff,
                    as: 'deanDepartmentData',
                    attributes: ['id', 'position'],
                    include: [{
                        model: db.User,
                        as: 'staffUserData',
                        attributes: ['firstName', 'lastName', 'email', 'avatar'],
                    }]
                },
                {
                    model: db.Room,
                    as: 'roomData',
                    attributes: ['id', "name"],
                    raw: true,
                },
                {
                    model: db.Staff,
                    as: 'staffDepartmentData', // alias cho mối quan hệ với Staff
                    attributes: ["id", "position", "price"], // Lấy ra các trường id, position, price
                    raw: true,
                    required: false
                }
            ],
            order: [
                ["status", "DESC"],
                ['createdAt', 'DESC']], // Sắp xếp theo ngày tạo mới nhất

            // Phân trang
            offset: (+page - 1) * +limit,
            limit: +limit,
            raw: false,
            nest: true,
        });
        console.log(department);
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
const getAllNameDepartment = async () => {
    try {
        let department = await db.Department.findAll({
            where: { status: status.ACTIVE },
            attributes: [
                ['id', 'value'],  // Đổi tên cột id
                ['name', 'label']  // Đổi tên cột name 
            ],
            order: [['name', 'ASC']],
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
            where: { id: departmentId },
            include: [{
                model: db.Description,
                as: 'departmentDescriptionData',
                attributes: ['markDownContent', 'htmlContent'],
                required: false,
                where: { status: status.ACTIVE },
            }, {
                model: db.Staff,
                as: 'deanDepartmentData',
                attributes: ['id', 'position'],
                include: [{
                    required: false,
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
    try {
        let department = await db.Department.findOne({
            where: { id: departmentId, status: status.ACTIVE },
            include: [{
                model: db.Staff,
                as: 'staffDepartmentData',
                attributes: ['id', 'position', 'price'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['id', 'lastName', 'firstName', 'email', 'dob', 'phoneNumber', 'avatar', 'roleId'],
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
        if (descriptionId) {
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
        } else {
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
                    descriptionId: description.id,
                    status: data.status,
                    address: data.address
                });
                return {
                    EC: 0,
                    EM: "Cập nhật phòng ban thành công",
                    DT: department
                }
            } else {
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

const blockDepartment = async (departmentId) => {
    try {
        let department = await db.Department.findOne({
            where: { id: departmentId },
        });
        if (department) {
            let departmentBlock = await db.Department.update({
                status: status.INACTIVE,
            }, {
                where: { id: department.id }
            });
            if (departmentBlock) {
                return {
                    EC: 0,
                    EM: "Khóa khoa thành công",
                    DT: department
                }
            } else {
                return {
                    EC: 500,
                    EM: "Khóa khoa thất bại",
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
const deleteDepartment = async (departmentId) => {
    try {


        let department = await db.Department.findOne({
            where: { id: departmentId },
        });
        if (department) {
            await db.Staff.update(
                { departmentId: 1 }, // Giá trị cần cập nhật
                {
                    where: {
                        departmentId: department.id
                    }
                }
            );
            await db.Room.update(
                { departmentId: 1 }, // Giá trị cần cập nhật
                {
                    where: {
                        departmentId: department.id
                    }
                }
            );
            let description = await db.Description.destroy({
                where: { id: department.descriptionId }
            });
            if (description) {
                await db.Department.destroy({
                    where: {
                        id: department.id,
                    },
                });
                return {
                    EC: 0,
                    EM: "Xóa phòng ban thành công",
                    DT: department
                }
            } else {
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
    deleteDepartment,
    getAllNameDepartment,
    blockDepartment
}