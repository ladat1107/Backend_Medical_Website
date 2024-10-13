import db from "../models/index";
import { status } from "../utils/index";

const getAllRoomTypes = async () => {
    try{
        let roomType = await db.RoomType.findAll({
            where: { status: status.ACTIVE },
            attributes: ['id', 'name', 'price', 'description'],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin loại phòng thành công",
            DT: roomType
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

const getRoomTypeById = async (roomTypeId) => {
    try{
        let roomType = await db.RoomType.findOne({
            where: { id: roomTypeId },
            raw: true,
            nest: true,
        });
        if (roomType) {
            return {
                EC: 0,
                EM: "Lấy thông tin loại phòng thành công",
                DT: roomType
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
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const createRoomType = async (data) => {
    try{
        let roomType = await db.RoomType.create({
            name: data.name,
            price: data.price,
            status: status.ACTIVE,
            description: data.description,
        });
        return {
            EC: 0,
            EM: "Tạo loại phòng thành công",
            DT: roomType
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

const updateRoomType = async (data) => {
    try{
        let roomType = await db.RoomType.update({
            name: data.name,
            price: data.price,
            description: data.description,
        }, {
            where: { id: data.id }
        });
        if (roomType) {
            return {
                EC: 0,
                EM: "Cập nhật loại phòng thành công",
                DT: roomType
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
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const updateStatusRoomType = async (data) => {
    try{
        let roomType = await db.RoomType.update({
            status: data.status,
        }, {
            where: { id: data.id }
        });
        if (roomType) {
            return {
                EC: 0,
                EM: "Cập nhật trạng thái loại phòng thành công",
                DT: roomType
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
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

module.exports = {
    getAllRoomTypes,
    getRoomTypeById,
    createRoomType,
    updateRoomType,
    updateStatusRoomType,
}