import { Op, where } from "sequelize";
import db from "../models";
import { status } from "../utils";
import paraclinical from "../models/paraclinical";

let getSpecialtySelect = async () => {
    try {
        let specialtyData = await db.Specialty.findAll({
            where: { status: status.ACTIVE },
            attributes: [
                ['id', 'value'],
                ['name', 'label']
            ]
        });
        return {
            EC: 0,
            EM: "Lấy thông tin chuyên khoa thành công",
            DT: specialtyData
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
let getAllSpecialtyAdmin = async (page, limit, search) => {
    try {
        let specialtyData = await db.Specialty.findAndCountAll({
            where: {
                [Op.or]: [{ name: { [Op.like]: `%${search}%` } },]
            },
            order: [
                ["status", "DESC"],
                ['id']], // Sắp xếp theo ngày tạo mới nhất

            // Phân trang
            offset: (+page - 1) * +limit,
            limit: +limit,
            raw: false,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin chuyên khoa thành công",
            DT: specialtyData
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
let getSpcialtyHome = async () => {
    try {
        let specialtyData = await db.Specialty.findAll({
            where: { status: status.ACTIVE },
            attributes: ["id", "name", "image"]
        });
        return {
            EC: 0,
            EM: "Lấy thông tin chuyên khoa thành công",
            DT: specialtyData
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
let createSpecialty = async (data) => {
    try {
        let specialty = await db.Specialty.create({
            name: data?.name,
            image: data?.image,
            shortDescription: data?.shortDescription,
            status: status.ACTIVE,
        });
        if (!specialty) {
            return {
                EC: 400,
                EM: "Tạo chuyên khoa thất bại",
                DT: ""
            }
        }
        return {
            EC: 0,
            EM: "Tạo chuyên khoa thành công",
            DT: specialty
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
let updateSpecialty = async (data) => {
    try {
        let specialty = await db.Specialty.update({
            name: data?.name || null,
            image: data?.image || null,
            shortDescription: data?.shortDescription || null,
            status: data?.status,
        }, {
            where: { id: data.id }
        });
        if (!specialty) {
            return {
                EC: 400,
                EM: "Cập nhật chuyên khoa thất bại",
                DT: ""
            }
        }
        return {
            EC: 0,
            EM: "Cập nhật chuyên khoa thành công",
            DT: specialty
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
let blockSpecialty = async (data) => {
    try {
        let specialty = await db.Specialty.update({
            status: status.INACTIVE
        }, {
            where: { id: data.id }
        });
        if (!specialty) {
            return {
                EC: 400,
                EM: "Khóa chuyên khoa thất bại",
                DT: ""
            }
        }
        return {
            EC: 0,
            EM: "Khóa chuyên khoa thành công",
            DT: specialty
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
let deleteSpecialty = async (data) => {
    let transaction = await db.sequelize.transaction();
    try {
        await db.Staff.update({ specialtyId: null },// Giá trị cần cập nhật
            {
                where: {
                    specialtyId: data.id
                }
            }, { transaction });
        await db.Room.update(
            { medicalExamination: null }, // Giá trị cần cập nhật
            {
                where: {
                    medicalExamination: data.id
                }
            }
            , { transaction });
        let specialty = await db.Specialty.destroy({
            where: { id: data.id }
        }, { transaction });
        if (specialty) {
            await transaction.commit();
            return {
                EC: 0,
                EM: "Xóa chuyên khoa thành công",
                DT: specialty
            }
        } else {
            return {
                EC: 400,
                EM: "Xóa chuyên khoa thất bại",
                DT: ""
            }
        }
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}
let getSpecialtyById = async (id) => {
    try {
        let specialtyData = await db.Specialty.findOne({
            where: { id: id, status: status.ACTIVE },
            include: [
                {
                    model: db.Staff,
                    as: "staffSpecialtyData",
                    attributes: ["id", "price", "position"],
                    include: [
                        {
                            model: db.User,
                            as: "staffUserData",
                            attributes: ["id", "lastName", "firstName", "avatar"],
                        },
                        {
                            model: db.Department,
                            as: "staffDepartmentData",
                            attributes: ["id", "name"],
                        }
                    ]
                }
            ]
        });
        return {
            EC: 0,
            EM: "Lấy thông tin chuyên khoa thành công",
            DT: specialtyData
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

const getSpecialtiesByDepartment = async () => {
    try {
        let roomsWithSpecialties = await db.Room.findAll({
            attributes: ['id', 'name'],
            where: {
                departmentId: 2,
            },
            include: [
                {
                    model: db.Specialty,
                    as: 'specialtyData',
                    attributes: ['name'],
                },
                {
                    model: db.Schedule,
                    as: 'scheduleRoomData',
                    attributes: ['staffId', 'date'],
                    where: {
                        date: {
                            [db.Sequelize.Op.gte]: new Date().setHours(0, 0, 0, 0),
                            [db.Sequelize.Op.lte]: new Date().setHours(23, 59, 59, 999),
                        },
                    },
                    include: [
                        {
                            model: db.Staff,
                            as: 'staffScheduleData',
                            attributes: ['id', 'price'],
                            include: [
                                {
                                    model: db.User,
                                    as: 'staffUserData',
                                    attributes: ['lastName', 'firstName'],
                                    where: {
                                        roleId: 3 // Bác sĩ
                                    },
                                    required: true, 
                                }
                            ],
                            required: true, 
                        },
                    ],
                    required: true, 
                },
            ],
            raw: true,
            nest: true,
        });

        let updatedRooms = roomsWithSpecialties.map(room => ({
            id: room.id,
            name: room.name,
            specialty: room.specialtyData.name,
            staffId: room.scheduleRoomData.staffScheduleData.id,
            staffName: `${room.scheduleRoomData.staffScheduleData.staffUserData.lastName} ${room.scheduleRoomData.staffScheduleData.staffUserData.firstName}`,
            staffPrice: room.scheduleRoomData.staffScheduleData.price || 0,
            scheduleDate: room.scheduleRoomData.date,
        }));

        return {
            EC: 0,
            EM: "Lấy thông tin thành công",
            DT: updatedRooms,
        };
    } catch (error) {
        console.error(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        };
    }
};

const getSpecialtiesByLaboratory = async (labId) => {
    try {
        
        let roomsWithSpecialties = await db.Room.findAll({
            attributes: [
                'id',
                'name',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('roomParaclinicalData.id')), 'paraclinicalCount'],
                // Remove other non-aggregated columns from attributes
            ],
            include: [
                {
                    model: db.Paraclinical,
                    as: 'roomParaclinicalData',
                    attributes: [],
                },
                {
                    model: db.ServiceType,
                    as: 'serviceData',
                    attributes: ['id', 'name'],
                    where: {
                        isLaboratory: 0,
                        id: labId,
                    },
                },
                {
                    model: db.Schedule,
                    as: 'scheduleRoomData',
                    attributes: ['staffId', 'date'],
                    where: {
                        date: {
                            [db.Sequelize.Op.gte]: new Date().setHours(0, 0, 0, 0),
                            [db.Sequelize.Op.lte]: new Date().setHours(23, 59, 59, 999),
                        },
                    },
                    include: [
                        {
                            model: db.Staff,
                            as: 'staffScheduleData',
                            attributes: ['id'],
                            include: [
                                {
                                    model: db.User,
                                    as: 'staffUserData',
                                    attributes: ['lastName', 'firstName'],
                                    where: {
                                        roleId: 3,
                                    },
                                    required: true,
                                }
                            ],
                            required: true,
                        },
                    ],
                    required: true,
                },
            ],
            group: ['Room.id', 
                    'serviceData.id', 
                    'serviceData.name', 
                    'scheduleRoomData.staffId', 
                    'scheduleRoomData.date',
                    'scheduleRoomData->staffScheduleData.id',
                    'scheduleRoomData->staffScheduleData->staffUserData.lastName',
                    'scheduleRoomData->staffScheduleData->staffUserData.firstName'
            ], 
            raw: true,
            nest: true,
        });

        const roomWithMinCount = roomsWithSpecialties.reduce((min, current) => 
            (current.paraclinicalCount < min.paraclinicalCount) ? current : min
        );

        let updatedRooms = {
            id: roomWithMinCount.id,
            name: roomWithMinCount.name,
            paraclinical: roomWithMinCount.roomParaclinicalData,
            serviceId: roomWithMinCount.serviceData.id,
            serviceName: roomWithMinCount.serviceData.name,
            count: roomWithMinCount.paraclinicalCount,
            staffId: roomWithMinCount.scheduleRoomData.staffScheduleData.id,
            staffName: `${roomWithMinCount.scheduleRoomData.staffScheduleData.staffUserData.lastName} ${roomWithMinCount.scheduleRoomData.staffScheduleData.staffUserData.firstName}`,
            scheduleDate: roomWithMinCount.scheduleRoomData.date,
        };

        return {
            EC: 0,
            EM: "Lấy thông tin thành công",
            DT: updatedRooms,
        };
    } catch (error) {
        console.error(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        };
    }
};

module.exports = {
    getSpecialtySelect,
    getSpcialtyHome,
    createSpecialty,
    updateSpecialty,
    blockSpecialty,
    deleteSpecialty,
    getAllSpecialtyAdmin,
    getSpecialtyById,
    getSpecialtiesByDepartment,
    getSpecialtiesByLaboratory
}