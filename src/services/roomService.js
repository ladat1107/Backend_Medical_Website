import db from "../models/index";
import { status } from "../utils/index";

const getAllRooms = async () => {
    try {
        let room = await db.Room.findAll({
            where: { status: status.ACTIVE },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin phòng thành công",
            DT: room
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

const getRoomByDepartment = async (departmentId) => {
    try {
        let room = await db.Room.findAll({
            where: { departmentId: departmentId, status: status.ACTIVE },
            include: [
                {
                    model: db.Department,
                    as: 'roomDepartmentData',
                    attributes: ['id', 'name'],
                },
                {
                    model: db.RoomServiceType,
                    as: 'serviceData',
                    //attributes: ['id', 'name', 'price'],
                    required: false,
                }
            ],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin phòng thành công",
            DT: room
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

const getRoomById = async (roomId) => {
    try {
        let room = await db.Room.findOne({
            where: { id: roomId },
            include: [
                {
                    model: db.Department,
                    as: 'roomDepartmentData',
                    attributes: ['id', 'name'],
                },
                {
                    model: db.ServiceType,
                    as: 'roomServiceTypeData',
                    attributes: ['id', 'name', 'price'],
                }
            ],
            raw: true,
            nest: true,
        });
        if (room) {
            return {
                EC: 0,
                EM: "Lấy thông tin phòng thành công",
                DT: room
            }
        } else {
            return {
                EC: 404,
                EM: "Không tìm thấy phòng",
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

const createRoom = async (data) => {
    try {
        let room = await db.Room.create({
            name: data.name,
            typeRoom: data.typeRoom,
            departmentId: data.departmentId,
            medicalExamination: data.medicalExamination,
            status: status.ACTIVE,
        });
        return {
            EC: 0,
            EM: "Tạo phòng thành công",
            DT: room
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

const updateRoom = async (data) => {
    try {
        let room = await db.Room.update({
            name: data.name,
            typeRoom: data.typeRoom,
            departmentId: data.departmentId,
            medicalExamination: data.medicalExamination,
        }, {
            where: { id: data.id }
        });
        return {
            EC: 0,
            EM: "Cập nhật phòng thành công",
            DT: room
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

const updateStatusRoom = async (data) => {
    try {
        let room = await db.Room.update({
            status: data.status,
        }, {
            where: { id: data.id }
        });
        return {
            EC: 0,
            EM: "Cập nhật trạng thái phòng thành công",
            DT: room
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
    getAllRooms,
    getRoomByDepartment,
    getRoomById,
    createRoom,
    updateRoom,
    updateStatusRoom
}