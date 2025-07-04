import db from "../models/index";
import descriptionService from "./descriptionService";
import { ERROR_SERVER, ROLE, status } from "../utils/index";
export const { Op, } = require('sequelize');

export const getAllHandBooks = async (page, limit, search, staffId, filter, statusFind) => {
    try {
        // Nếu có filter, chuyển thành mảng

        let filterArray = filter ? filter?.split(",") : [];
        let whereCondition = {};
        if (statusFind) {
            whereCondition.status = statusFind;
        }
        // Đếm tổng số lượng bản ghi phù hợp với điều kiện tìm kiếm
        let totalItems = await db.Handbook.count({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${search}%` } },
                    { '$handbookStaffData.staffUserData.firstName$': { [Op.like]: `%${search}%` } },
                    { '$handbookStaffData.staffUserData.lastName$': { [Op.like]: `%${search}%` } },
                ],
                // Kiểm tra xem tags có chứa tất cả các giá trị trong filterArray
                ...(filterArray.length > 0 && {
                    tags: {
                        [Op.and]: filterArray.map(tag => ({
                            [Op.like]: `%${tag}%` // Mỗi giá trị trong filterArray sẽ được kiểm tra với tags
                        }))
                    }
                }),
                ...(staffId && {
                    author: staffId
                }),
                ...whereCondition
            },
            include: [{
                model: db.Staff,
                as: 'handbookStaffData',
                required: true,
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    required: true,
                }]
            }],
        });

        // Lấy danh sách bản ghi với phân trang
        let handBooks = await db.Handbook.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${search}%` } },
                    { '$handbookStaffData.staffUserData.firstName$': { [Op.like]: `%${search}%` } },
                    { '$handbookStaffData.staffUserData.lastName$': { [Op.like]: `%${search}%` } },
                ],
                // Kiểm tra xem tags có chứa tất cả các giá trị trong filterArray
                ...(filterArray.length > 0 && {
                    tags: {
                        [Op.and]: filterArray.map(tag => ({
                            [Op.like]: `%${tag}%` // Mỗi giá trị trong filterArray sẽ được kiểm tra với tags
                        }))
                    }
                }),
                ...(staffId && {
                    author: staffId
                }),
                ...whereCondition
            },
            include: [{
                model: db.Staff,
                as: 'handbookStaffData',
                attributes: ['id', 'position'],
                required: true,
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    required: true,
                    attributes: ['firstName', 'lastName', 'email', 'avatar'],
                }, {
                    model: db.Department,
                    as: 'staffDepartmentData',
                    attributes: ['id', 'name']
                }]
            }],
            attributes: ['id', 'title', 'image', 'createdAt', 'updatedAt', 'shortDescription', 'tags'],
            offset: (+page - 1) * +limit,
            limit: +limit,
            raw: true,
            nest: true,
        });

        return {
            EC: 0,
            EM: "Lấy thông tin cẩm nang thành công",
            DT: {
                totalItems,
                handBooks
            }
        };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}

export const getHandBookHome = async (filter) => {
    try {
        let condition = {};
        let limit = filter?.limtit || 100;
        let filterArray = filter.tags ? filter.tags?.split(",") : [];
        if (filter.departmentId) {
            condition.departmentId = filter.departmentId;
        }
        let handBooks = await db.Handbook.findAll({
            where: {
                status: status.ACTIVE,
                ...(filterArray.length > 0 && {
                    tags: {
                        [Op.or]: filterArray.map(tag => ({
                            [Op.like]: `%${tag}%` // Mỗi giá trị trong filterArray sẽ được kiểm tra với tags
                        }))
                    }
                }),
            },
            include: [{
                model: db.Staff,
                where: { ...condition },
                as: 'handbookStaffData',
                attributes: ['id', 'position'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['firstName', 'lastName', 'email']
                }]
            }],
            order: [['view']],
            limit: limit,
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin cẩm nang thành công",
            DT: handBooks
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getHandbookAdmin = async (page, limit, search, status, filter) => {
    try {
        let whereCondition = {};
        let filterArray = filter ? filter.split(",") : [];
        // Kiểm tra điều kiện departmentId
        if (status) {
            whereCondition.status = +status;
        }
        //console.log("whereCondition", whereCondition);
        let handbooks = await db.Handbook.findAndCountAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${search}%` } },
                    { shortDescription: { [Op.like]: `%${search}%` } },
                ],
                ...(filterArray.length > 0 && {
                    tags: {
                        [Op.and]: filterArray.map(tag => ({
                            [Op.like]: `%${tag}%` // Mỗi giá trị trong filterArray sẽ được kiểm tra với tags
                        }))
                    }
                }),
                ...whereCondition,
            },
            include: [{
                model: db.Staff,
                as: 'handbookStaffData',
                required: true,
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    required: true,
                }]
            }],
            order: [['updatedAt', 'DESC']],
            offset: (+page - 1) * +limit,
            limit: +limit,
            raw: false,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin thành công",
            DT: handbooks
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getHandBookById = async (handBookId, role) => {
    try {
        let handBook = await db.Handbook.findOne({
            where: { id: handBookId },
            include: [
                {
                    model: db.Staff,
                    as: 'handbookStaffData',
                    attributes: ['id', 'position'],
                    include: [{
                        model: db.User,
                        as: 'staffUserData',
                        attributes: ['firstName', 'lastName', 'email', 'avatar']
                    }, {
                        model: db.Department,
                        as: 'staffDepartmentData',
                        attributes: ['id', 'name']
                    }]
                }
            ],
            raw: true,
            nest: true,
        });
        if (handBook) {
            return {
                EC: 0,
                EM: "Lấy thông tin cẩm nang thành công",
                DT: handBook
            }
        }
        return {
            EC: 404,
            EM: "Không tìm thấy cẩm nang",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createHandBook = async (data) => {
    try {
        let handBook = await db.Handbook.create({
            title: data.title,
            author: data.author,
            image: data.image,
            shortDescription: data?.shortDescription || null,
            tags: data.tags || null,
            status: status.PENDING,
            htmlDescription: data?.htmlDescription || null,
        });
        return {
            EC: 0,
            EM: "Tạo cẩm nang thành công",
            DT: handBook
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateHandBook = async (data) => {
    try {
        let handBook = await db.Handbook.findOne({
            where: { id: data.id },
        });
        if (handBook) {
            if (handBook.author === data.author) {
                await handBook.update({
                    title: data.title,
                    image: data.image,
                    shortDescription: data?.shortDescription || null,
                    htmlDescription: data?.htmlDescription || null,
                    tags: data.tags || null,
                });
                return { EC: 0, EM: "Cập nhật cẩm nang thành công", DT: handBook }
            } else {
                return { EC: 403, EM: "Cẩm nang không thuộc quyền sở hữu của bạn", DT: "", }
            }
        } else {
            return { EC: 404, EM: "Không tìm thấy cẩm nang", DT: "", }
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateHandbookStatus = async (data) => {
    try {
        let handBook = await db.Handbook.findOne({
            where: { id: data.id }
        });
        if (handBook) {
            await handBook.update({
                status: data.status,
            });
            return {
                EC: 0,
                EM: "Duyệt cẩm nang thành công",
                DT: handBook
            }
        } else {
            return {
                EC: 404,
                EM: "Không tìm thấy cẩm nang",
                DT: "",
            }
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
