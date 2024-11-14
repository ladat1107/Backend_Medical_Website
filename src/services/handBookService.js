import db from "../models/index";
import descriptionService from "./descriptionService";
import { status } from "../utils/index";
const { Op } = require('sequelize');

const getAllHandBooks = async (page, limit, search, filter) => {
    try {
        // Nếu có filter, chuyển thành mảng
        let filterArray = filter ? filter.split(",") : [];

        // Đếm tổng số lượng bản ghi phù hợp với điều kiện tìm kiếm
        let totalItems = await db.Handbook.count({
            where: {
                status: status.ACTIVE,
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
                })
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
                status: status.ACTIVE,
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
                })
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        };
    }
}

const getAllTags = async () => {
    try {
        let handBooks = await db.Handbook.findAll({
            attributes: ['tags'],
            where: {
                status: status.ACTIVE
            },
            raw: true
        });

        let allTags = [];
        handBooks.forEach(handbook => {
            if (handbook.tags) {
                const tags = handbook.tags.split(',').map(tag => tag.trim());
                allTags = [...allTags, ...tags];
            }
        });

        const tagCount = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});

        const sortedTags = Object.entries(tagCount)
            .sort((a, b) => b[1] - a[1])
            .map(([tag]) => tag);

        return {
            EC: 0,
            EM: "Lấy thông tin các tag thành công",
            DT: sortedTags
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        };
    }
};

const getHandBookHome = async () => {
    try {
        let handBooks = await db.Handbook.findAll({
            where: { status: status.ACTIVE },
            include: [{
                model: db.Staff,
                as: 'handbookStaffData',
                attributes: ['id', 'position'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['firstName', 'lastName', 'email']
                }]
            }],
            order: [['updatedAt', 'DESC']],
            limit: 20,
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const getHandBooksByStatus = async (handBookStatus) => {
    try {
        let handBooks = await db.Handbook.findAll({
            where: { status: handBookStatus },
            include: [{
                model: db.Staff,
                as: 'handbookStaffData',
                attributes: ['id', 'position'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['firstName', 'lastName', 'email', 'avatar', "shortDescription", 'tags'],
                }, {
                    model: db.Department,
                    as: 'staffDepartmentData',
                    attributes: ['id', 'name']
                }]
            }],
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const getHandBookById = async (handBookId) => {
    try {
        let handBook = await db.Handbook.findOne({
            where: { id: handBookId },
            include: [
                {
                    model: db.Description,
                    as: 'handbookDescriptionData',
                    attributes: ['markDownContent', 'htmlContent'],
                    where: { status: status.ACTIVE },
                },
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const createHandBook = async (data) => {
    try {
        let descriptionId = await descriptionService.createDescription(data);
        if (descriptionId) {
            let handBook = await db.Handbook.create({
                title: data.title,
                author: data.author,
                image: data.image,
                shortDescription: data?.shortDescription || null,
                tags: data.tags || null,
                status: status.PENDING,
                descriptionId: descriptionId
            });
            return {
                EC: 0,
                EM: "Tạo cẩm nang thành công",
                DT: handBook
            }
        } else {
            await descriptionService.deleteDescription(descriptionId);
            return {
                EC: 500,
                EM: "Tạo cẩm nang thất bại",
                DT: "",
            }
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

const updateHandBook = async (data) => {
    try {
        let handBook = await db.Handbook.findOne({
            where: { id: data.id },
        });
        if (handBook && handBook.author === data.author) {
            let description = await descriptionService.updateDescription(data, handBook.descriptionId);
            if (description) {
                await handBook.update({
                    title: data.title,
                    image: data.image,
                    shortDescription: data?.shortDescription || null,
                    tags: data.tags || null,
                });
                return {
                    EC: 0,
                    EM: "Cập nhật cẩm nang thành công",
                    DT: handBook
                }
            } else {
                return {
                    EC: 500,
                    EM: "Cập nhật cẩm nang thất bại",
                    DT: "",
                }
            }
        } else {
            return {
                EC: 404,
                EM: "Không tìm thấy cẩm nang/ Cẩm nang không thuộc quyền quản lý của bạn",
                DT: "",
            }
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

const updateHandbookStatus = async (data) => {
    try {
        let handBook = await db.Handbook.findOne({
            where: { id: data.id },
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

module.exports = {
    getAllHandBooks,
    getHandBooksByStatus,
    getHandBookById,
    createHandBook,
    updateHandBook,
    updateHandbookStatus,
    getHandBookHome,
    getAllTags
}