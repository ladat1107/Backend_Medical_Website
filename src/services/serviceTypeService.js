import { Op } from "sequelize";
import db from "../models/index";
import { ERROR_SERVER, status } from "../utils/index";

export const getAllServiceTypes = async () => {
    try {
        let serviceType = await db.ServiceType.findAll({
            where: { status: status.ACTIVE },
            attributes: ['id', 'name', 'price', 'description'],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin loại phòng thành công",
            DT: serviceType
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getServiceSearch = async () => {
    try {
        let serviceType = await db.ServiceType.findAll({
            where: { status: status.ACTIVE },
        });
        return {
            EC: 0,
            EM: "Lấy thông tin loại phòng thành công",
            DT: serviceType
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getAllServiceTypesAdmin = async (page, limit, search) => {
    try {
        let serviceType = await db.ServiceType.findAndCountAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { price: { [Op.like]: `%${search}%` } },
                ]
            },
            order: [
                ["status", "DESC"],
                ['createdAt', 'DESC']], // Sắp xếp theo ngày tạo mới nhất

            // Phân trang
            offset: (+page - 1) * +limit,
            limit: +limit,
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin loại phòng thành công",
            DT: serviceType
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getServiceTypeById = async (ServiceTypeId) => {
    try {
        let serviceType = await db.ServiceType.findOne({
            where: { id: ServiceTypeId },
            raw: true,
            nest: true,
        });
        if (serviceType) {
            return {
                EC: 0,
                EM: "Lấy thông tin loại phòng thành công",
                DT: serviceType
            }
        } else {
            return {
                EC: 404,
                EM: "Không tìm thấy loại phòng",
                DT: "",
            }
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createServiceType = async (data) => {
    try {
        let serviceType = await db.ServiceType.create({
            name: data.name,
            price: data.price,
            status: status.ACTIVE,
            description: data?.description || "",
            isLaboratory: data?.isLaboratory ? 1 : 0,
        });
        return {
            EC: 0,
            EM: "Tạo loại phòng thành công",
            DT: serviceType
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateServiceType = async (data) => {
    try {
        let serviceType = await db.ServiceType.update({
            name: data.name,
            price: data.price,
            description: data.description,
            isLaboratory: data.isLaboratory ? 1 : 0,
            status: data.status,
        }, {
            where: { id: data.id }
        });
        if (serviceType) {
            return {
                EC: 0,
                EM: "Cập nhật loại phòng thành công",
                DT: serviceType
            }
        } else {
            return {
                EC: 404,
                EM: "Không tìm thấy loại phòng",
                DT: "",
            }
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const blockStatusServiceType = async (id) => {
    try {
        let serviceType = await db.ServiceType.update({
            status: status.INACTIVE,
        }, {
            where: { id: id }
        });
        if (serviceType) {
            return {
                EC: 0,
                EM: "Khóa dịch vụ thành công",
                DT: serviceType
            }
        } else {
            return {
                EC: 404,
                EM: "Không tìm thấy loại dịch vụ",
                DT: "",
            }
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const deleteStatusServiceType = async (id) => {
    try {
        let serviceType = await db.ServiceType.findOne({
            where: { id: id }
        });
        if (serviceType) {
            await serviceType.destroy();
            return {
                EC: 0,
                EM: "Xóa dịch vụ thành công",
                DT: serviceType
            }
        } else {
            return {
                EC: 404,
                EM: "Không tìm thấy loại dịch vụ",
                DT: "",
            }
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getServiceLaboratory = async () => {
    try {
        let serviceType = await db.ServiceType.findAll({
            where: { status: status.ACTIVE, isLaboratory: 0 },
            attributes: ['id', 'name', 'price', 'description'],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin loại phòng thành công",
            DT: serviceType
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
