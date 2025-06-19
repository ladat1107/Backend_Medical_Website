import { Op } from "sequelize";
import db from "../models/index";
import { ERROR_SERVER, status, typeRoom } from "../utils/index";

export const getAllDepartment = async (page, limit, search) => {
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
            distinct: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin phòng ban thành công",
            DT: department
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getDepartmentDuty = async () => {
    try {
        let department = await db.Department.findAll({
            where: { status: status.ACTIVE },
            include: [
                {
                    model: db.Room,
                    as: 'roomData',
                    where: { status: status.ACTIVE, },
                    required: true,
                    include: [
                        {
                            model: db.ServiceType,
                            as: 'serviceData',
                            attributes: [],
                            where: { id: { [Op.in]: [typeRoom.CLINIC, typeRoom.DUTY, typeRoom.LABORATORY] } },
                            through: { attributes: [] },
                        },
                    ],
                    attributes: ['id', "name"],
                    raw: true,
                },
            ],
            attributes: ['id', 'name'],
            order: [['name']], // Sắp xếp theo ngày tạo mới nhất
            raw: false,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin phòng ban thành công",
            DT: department
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getDepartmentHome = async () => {
    try {
        let departments = await db.Department.findAll({
            where: { status: status.ACTIVE },
        });
        return {
            EC: 0,
            EM: "Lấy thông tin phòng ban thành công",
            DT: departments
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getAllNameDepartment = async () => {
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
        return ERROR_SERVER
    }
}
export const getDepartmentById = async (departmentId) => {
    try {
        let department = await db.Department.findOne({
            where: { id: departmentId },
            include: [{
                model: db.Staff,
                as: 'deanDepartmentData',
                attributes: ['id', 'position'],
                include: [{
                    required: false,
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['firstName', 'lastName', 'email', 'avatar'],
                }]
            }, {
                model: db.Staff,
                as: 'staffDepartmentData',
                attributes: ['id', 'position', 'price'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['id', 'lastName', 'firstName', 'email', 'dob', 'phoneNumber', 'avatar', 'roleId'],
                    where: { status: status.ACTIVE },
                }],
            }],
            raw: false,
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
        return ERROR_SERVER
    }
}

export const getAllStaffInDepartment = async (departmentId) => {
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
        return ERROR_SERVER
    }
}

export const createDepartment = async (data) => {
    try {
        let department = await db.Department.create({
            name: data?.name,
            image: data?.image,
            deanId: data?.deanId || null,
            shortDescription: data?.shortDescription,
            status: status.ACTIVE,
            address: data?.address,
            htmlDescription: data?.htmlDescription || null,
        });
        return {
            EC: 0,
            EM: "Tạo phòng ban thành công",
            DT: department
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const updateDepartment = async (data) => {
    try {
        let department = await db.Department.update({
            name: data.name,
            image: data?.image,
            deanId: data.deanId,
            shortDescription: data?.shortDescription,
            htmlDescription: data?.htmlDescription || null,
            status: data?.status,
            address: data?.address
        }, {
            where: { id: data.id },
        });
        return {
            EC: 0,
            EM: "Cập nhật phòng ban thành công",
            DT: department
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const blockDepartment = async (departmentId) => {
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
        return ERROR_SERVER
    }
}
export const deleteDepartment = async (departmentId) => {
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
                    where: { departmentId: department.id }
                }
            );
            await db.Department.destroy({ where: { id: department.id } });

            return { EC: 0, EM: "Xóa phòng ban thành công", DT: department }
        } else return { EC: 400, EM: "Không tìm thấy phòng ban", DT: "", }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}


