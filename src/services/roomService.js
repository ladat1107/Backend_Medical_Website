import { Op } from "sequelize";
import db, { sequelize } from "../models/index";
import { ERROR_SERVER, status } from "../utils/index";
import dayjs from "dayjs";

export const getAllRooms = async (page, limit, search, filter) => {
    try {
        let whereCondition = {};

        // Kiểm tra điều kiện departmentId
        if (filter?.departmentId) {
            whereCondition.departmentId = +filter?.departmentId;
        }
        if (filter?.status) {
            whereCondition.status = +filter?.status;
        }
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
                    model: db.ServiceType,
                    as: 'serviceData',
                    attributes: ['id', 'name'],
                    required: filter?.typeRoom ? true : false,
                    where: filter?.typeRoom ? { id: +filter?.typeRoom } : undefined,
                    through: {
                        attributes: [],
                    },
                    nest: true,
                }, {
                    model: db.Examination,
                    as: 'examinationRoomData',
                    attributes: ['id'],
                    where: { status: { [Op.ne]: status.DONE_INPATIENT } },
                    required: false,
                }
            ],
            order: [['createdAt', 'DESC']],
            offset: (+page - 1) * +limit,
            limit: +limit,
            nest: true,
            distinct: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin phòng thành công",
            DT: room
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getRoomByDepartment = async (departmentId) => {
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
        return ERROR_SERVER
    }
}

export const getRoomById = async (roomId) => {
    try {
        let room = await db.Room.findOne({
            where: { id: roomId },
            include: [
                {
                    model: db.ServiceType,
                    as: 'serviceData',
                    attributes: ['id', 'name', 'price', 'description'],
                    required: false,
                },
                {
                    model: db.Examination,
                    as: "examinationRoomData",
                    where: { status: { [Op.ne]: status.DONE_INPATIENT } },
                    required: false,
                    include: [
                        {
                            model: db.User,
                            as: "userExaminationData",
                            attributes: ['id', 'lastName', 'firstName', 'phoneNumber', 'avatar'],
                        }
                    ]
                }, {
                    model: db.Schedule,
                    as: "scheduleRoomData",
                    where: { date: dayjs().format('YYYY-MM-DD') },
                    required: false,
                    include: [
                        {
                            model: db.Staff,
                            as: "staffScheduleData",
                            include: [
                                {
                                    model: db.User,
                                    as: "staffUserData",
                                    attributes: ['id', 'lastName', 'firstName', 'phoneNumber', 'avatar', 'email'],
                                    include: [
                                        { model: db.Role, as: "userRoleData", attributes: ['id', 'name'] }
                                    ]
                                },
                                {
                                    model: db.Specialty,
                                    as: "staffSpecialtyData",
                                    attributes: ['id', 'name'],
                                }
                            ]
                        }
                    ]
                }
            ],
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
        return ERROR_SERVER
    }
}

export const createRoom = async (data) => {
    const t = await sequelize.transaction(); // Khởi tạo transaction
    try {
        // Tạo phòng
        let room = await db.Room.create({
            name: data.name,
            departmentId: data.departmentId,
            medicalExamination: data?.medicalExamination || null,
            capacity: data.capacity,
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

        await t.commit(); // Nếu mọi thứ thành công thì commit transaction
        return {
            EC: 0,
            EM: "Tạo phòng thành công",
            DT: room,
        };
    } catch (error) {
        console.log(error);
        await t.rollback(); // Nếu có lỗi thì rollback transaction
        return ERROR_SERVER
    }
}

export const updateRoom = async (data) => {
    let transaction = await sequelize.transaction();
    try {
        let room = await db.Room.update({
            name: data.name,
            departmentId: data.departmentId,
            status: data.status,
            medicalExamination: data?.medicalExamination,
            capacity: data.capacity,
        }, {
            where: { id: data.id }
        }, { transaction: transaction });

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

        await transaction.commit();
        return {
            EC: 0,
            EM: "Cập nhật phòng thành công",
            DT: room
        }

    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return ERROR_SERVER
    }
}

export const blockRoom = async (id) => {
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
        return ERROR_SERVER
    }
}
export const deleteRoom = async (id) => {
    let transaction = await sequelize.transaction();
    try {
        let room = await db.Room.findOne({
            where: { id: id },
            transaction: transaction
        });

        if (room) {
            await db.RoomServiceType.destroy({
                where: { roomId: room.id },
                transaction: transaction
            });

            await db.Room.destroy({
                where: {
                    id: room.id,  // Replace with your condition
                },
                transaction: transaction
            });

            await transaction.commit();

            return {
                EC: 0,
                EM: "Xóa phòng thành công",
                DT: room
            }
        } else {
            await transaction.rollback();
            return {
                EC: 404, EM: "Không tìm thấy phòng", DT: ""
            }
        }
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return ERROR_SERVER
    }
}

export const getAvailableRooms = async (medicalTreatmentTier) => {
    try {
        // Get all rooms with active status and service types with ID 3 or 4
        let rooms = await db.Room.findAll({
            where: {
                status: status.ACTIVE,
                capacity: { [Op.gt]: 0 } // Only include rooms with defined capacity
            },
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
                    required: true,
                    where: {
                        status: status.ACTIVE,
                        id: {
                            [Op.or]: +medicalTreatmentTier === 3 ? [6] :
                                +medicalTreatmentTier === 1 ? [3, 4] : null
                        }
                    },
                    through: { attributes: [] } // Exclude join table attributes
                }
            ],
            raw: false,
            nest: true,
        });

        // Get examination counts for each room
        const roomExamCounts = await Promise.all(
            rooms.map(async (room) => {
                const count = await db.Examination.count({
                    where: {
                        roomId: room.id,
                        [Op.or]: [
                            { medicalTreatmentTier: 1 },
                            { medicalTreatmentTier: 3 }
                        ],
                        [Op.or]: [
                            { status: status.EXAMINING },
                            { status: status.PAID },
                            { status: status.WAITING }
                        ]
                    }
                });
                return { roomId: room.id, count };
            })
        );

        // Create a map of room ID to examination count for easy lookup
        const roomCountMap = roomExamCounts.reduce((map, item) => {
            map[item.roomId] = item.count;
            return map;
        }, {});

        // Filter rooms where examination count is less than room capacity
        const availableRooms = rooms.filter(room => {
            const examCount = roomCountMap[room.id] || 0;
            return room.capacity > examCount;
        });

        // Add available capacity information to each room
        const roomsWithCapacity = availableRooms.map(room => {
            const examCount = roomCountMap[room.id] || 0;

            return {
                ...room.dataValues,
                availableCapacity: room.capacity - examCount,
                totalCapacity: room.capacity,
                currentExamCount: examCount,
                serviceData: room.serviceData // Maintain the service data as is
            };
        });

        return {
            EC: 0,
            EM: "Lấy thông tin phòng thành công",
            DT: roomsWithCapacity
        };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}

