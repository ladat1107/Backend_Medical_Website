import db from "../models/index";
import descriptionService from "./descriptionService";
import { status } from "../utils/index";
const { Op, where } = require('sequelize');

const getAllHandBooks = async (page, limit, search) => {
    try{
        let handBooks = await db.Handbook.findAll({
            where: { 
                status: status.ACTIVE,
                [Op.or]: [
                    { title: { [Op.like]: `%${search}%` } },
                    {'$handbookStaffData.staffUserData.firstName$': { [Op.like]: `%${search}%` }},
                    {'$handbookStaffData.staffUserData.lastName$': { [Op.like]: `%${search}%` }},
                ]
            },
            include:[{
                model: db.Staff,
                as: 'handbookStaffData',
                attributes: ['id', 'position'],
                required: true,
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    required: true,
                    attributes: ['firstName', 'lastName', 'email', 'avatar'],
                },{
                    model: db.Department,
                    as: 'staffDepartmentData',
                    attributes: ['id', 'name']
                }]
            }],
            attributes: ['id', 'title', 'image', 'createdAt'],
            offset: (+page - 1) * +limit,
            limit: +limit,
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
            EM: "Error from server",
            DT: "",
        }
    }
}

const getHandBooksByStatus = async (handBookStatus) => {
    try{
        let handBooks = await db.Handbook.findAll({
            where: { status: handBookStatus },
            include:[{
                model: db.Staff,
                as: 'handbookStaffData',
                attributes: ['id', 'position'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['firstName', 'lastName', 'email', 'avatar'],
                },{
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
            EM: "Error from server",
            DT: "",
        }
    }
}

const getHandBookById = async (handBookId) => {
    try{
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
                    },{
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
            EM: "Error from server",
            DT: "",
        }
    }
}

const createHandBook = async (data) => {
    try{
        let descriptionId = await descriptionService.createDescription(data);
        if(descriptionId){
            let handBook = await db.Handbook.create({
                title: data.title,
                author: data.author,
                image: data.image,
                status: status.PENDING,
                descriptionId: descriptionId
            });
            return {
                EC: 0,
                EM: "Tạo cẩm nang thành công",
                DT: handBook
            }
        } else{
            await descriptionService.deleteDescription(descriptionId);
            return {
                EC: 500,
                EM: "Tạo cẩm nang thất bại",
                DT: "",
            }
        }
    }catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const updateHandBook = async (data) => {
    try{
        let handBook = await db.Handbook.findOne({
            where: { id: data.id },
        }); 
        if(handBook && handBook.author === data.author){
            let description = await descriptionService.updateDescription(data, handBook.descriptionId);
            if (description) {
                await handBook.update({
                    title: data.title,
                    image: data.image,
                });
                return {
                    EC: 0,
                    EM: "Cập nhật cẩm nang thành công",
                    DT: handBook
                }   
            } else{
                return {
                    EC: 500,
                    EM: "Cập nhật cẩm nang thất bại",
                    DT: "",
                }
            } 
        } else{
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
            EM: "Error from server",
            DT: "",
        }
    }
}

const updateHandbookStatus = async (data) => {
    try{
        let handBook = await db.Handbook.findOne({
            where: { id: data.id },
        }); 
        if(handBook){
            await handBook.update({
                status: data.status,
            });
            return {
                EC: 0,
                EM: "Duyệt cẩm nang thành công",
                DT: handBook
            }   
        } else{
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
            EM: "Error from server",
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
}