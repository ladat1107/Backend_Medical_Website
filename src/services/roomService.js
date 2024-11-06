import db, { sequelize } from "../models/index";
import { status } from "../utils/index";

const getAllRooms = async (page, limit, search) => {
    try {
        let room = await db.Room.findAndCountAll({
            where: {},
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
                }
            ],
            offset: (page - 1) * limit,
            limit: limit,
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
                    status: status.ACTIVE,
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
            EM: "Error from server",
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
            awaitdb.Room.destroy(room);
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
    blockRoom,
    deleteRoom
}