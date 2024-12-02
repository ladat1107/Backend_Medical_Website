import { Op, or } from "sequelize";
import db, { sequelize } from "../models/index";
import { status } from "../utils/index";
import { raw } from "body-parser";

const getAllRooms = async (page, limit, search, searchDepartment) => {
    try {
        let whereCondition = {};
        // Kiểm tra điều kiện departmentId
        if (searchDepartment != 0) {
            whereCondition.departmentId = searchDepartment;
        }
        let countRoom = await db.Room.count();
        let room = await db.Room.findAndCountAll({
            where: {
                ...whereCondition,
                name: { [Op.like]: `%${search}%` } // Tìm kiếm theo tên phòng
            },
            include: [
                {
                    model: db.Department,
                    as: 'roomDepartmentData',
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Bed,
                    as: 'bedRoomData',
                    required: false,
                },
                {
                    model: db.ServiceType,
                    as: 'serviceData',
                    attributes: ['name'],
                    required: false,
                    through: {
                        attributes: []
                    },

                }

            ],
            order: [['createdAt', 'DESC']],
            offset: (page - 1) * limit,
            limit: limit,
            raw: false,
            nest: true,
        });
        room.count = countRoom;
        return {
            EC: 0,
            EM: "Lấy thông tin phòng thành công",
            DT: room
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
                    model: db.ServiceType,
                    as: 'serviceData',
                    attributes: ['id', 'name', 'price'],
                    required: false,
                }
            ],
            raw: false,
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
            EM: "Lỗi server!",
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
                    model: db.ServiceType,
                    as: 'serviceData',
                    attributes: ['id'],
                },
                {
                    model: db.Bed,
                    as: 'bedRoomData',
                    required: false,
                    raw: true,
                }
            ],
            raw: false,
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
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const createRoom = async (data) => {
    const t = await sequelize.transaction(); // Khởi tạo transaction
    try {
        // Tạo phòng
        let room = await db.Room.create({
            name: data.name,
            departmentId: data.departmentId,
            medicalExamination: data?.medicalExamination || null,
            status: status.ACTIVE,
        }, { transaction: t });

        // Nếu phòng được tạo và có serviceIds thì thêm RoomService
        if (room && data.serviceIds.length > 0) {
            let arrData = data.serviceIds.map(item => {
                return {
                    roomId: room.id,
                    serviceId: item,
                }
            });
            let roomService = await db.RoomServiceType.bulkCreate(arrData, { transaction: t });
            if (!roomService) {
                throw new Error("Lỗi thêm dịch vụ"); // Nếu thất bại thì ném lỗi
            }
        }
        // Nếu phòng được tạo và có bedQuantity thì tạo giường
        if (room && data.bedQuantity > 0) {
            let arrData = [];
            for (let i = 1; i <= +data.bedQuantity; i++) {
                let name = "Giường số " + i + " - " + room.name;
                arrData.push({
                    name: name,
                    roomId: room.id,
                    status: status.INACTIVE,
                });
            }
            let bed = await db.Bed.bulkCreate(arrData, { transaction: t });
            if (!bed) {
                throw new Error("Lỗi thêm giường"); // Nếu thất bại thì ném lỗi
            }
        }
        await t.commit(); // Nếu mọi thứ thành công thì commit transaction
        return {
            EC: 0,
            EM: "Tạo phòng thành công",
            DT: room,
        };
    } catch (error) {
        console.log(error);
        await t.rollback(); // Nếu có lỗi thì rollback transaction
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const updateRoom = async (data) => {
    let transaction = await sequelize.transaction();
    try {
        let room = await db.Room.update({
            name: data.name,
            departmentId: data.departmentId,
            status: data.status,
            medicalExamination: data?.medicalExamination,
        }, {
            where: { id: data.id }
        }, { transaction: transaction });
        if (room) {
            await db.RoomServiceType.destroy({
                where: { roomId: data.id }  // Replace `someRoomId` with the room ID you're deleting
            }, { transaction: transaction });
            if (data.serviceIds.length > 0) {
                let arrData = data.serviceIds.map(item => {
                    return {
                        roomId: data.id,
                        serviceId: item,
                    }
                });
                let roomService = await db.RoomServiceType.bulkCreate(arrData, { transaction: transaction });
                if (!roomService) {
                    throw new Error("Lỗi thêm dịch vụ"); // Nếu thất bại thì ném lỗi
                }
            }
            if (data.oldBed < data.newBed) {
                let arrData = [];
                for (let i = +data.oldBed + 1; i <= +data.newBed; i++) {
                    let name = "Giường số " + i + " - " + data.name;
                    arrData.push({
                        name: name,
                        roomId: data.id,
                        status: status.INACTIVE,
                    });
                }
                let bed = await db.Bed.bulkCreate(arrData, { transaction: transaction });
                if (!bed) {
                    throw new Error("Lỗi thêm giường"); // Nếu thất bại thì ném lỗi
                }
            }
            await transaction.commit();
            return {
                EC: 0,
                EM: "Cập nhật phòng thành công",
                DT: room
            }
        }
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const blockRoom = async (id) => {
    try {
        let room = await db.Room.update({
            status: status.INACTIVE,
        }, {
            where: { id: id }
        });
        return {
            EC: 0,
            EM: "Khóa phòng thành công",
            DT: room
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
const deleteRoom = async (id) => {
    try {
        let room = await db.Room.findOne({
            where: { id: id }
        });
        if (room) {
            await db.RoomServiceType.destroy({
                where: { roomId: room.id }  // Replace `someRoomId` with the room ID you're deleting
            });
            await db.Room.destroy({
                where: {
                    id: room.id,  // Replace with your condition
                },
            });
            return {
                EC: 0,
                EM: "Xóa phòng thành công",
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
            EM: "Lỗi server!",
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
    blockRoom,
    deleteRoom
}