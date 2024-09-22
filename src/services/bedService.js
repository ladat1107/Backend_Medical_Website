import { where } from "sequelize";
import db from "../models/index";
import { status } from "../utils/index";
import Sequelize from "sequelize";

const getAllBeds = async () => {
    try{
        let bed = await db.Bed.findAll({
            where: { status: status.ACTIVE },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin giường thành công",
            DT: bed
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

const getBedByRoom = async (roomId) => {
    try{
        let bed = await db.Bed.findAll({
            where: { roomId: roomId, status: status.ACTIVE },
            include: [
                {
                    model: db.Room,
                    as: 'bedRoomData',
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.Department,
                        as: 'roomDepartmentData',
                        attributes: ['id'],
                    }]
                },{
                    model: db.Patient,
                    as: 'bedPatientData',
                    attributes: ['id', 'dateOfAdmission', 'dateOfDischarge'],
                    include: [{
                        model: db.User,
                        as: 'patientUserData',
                        attributes: ['id', 'firstName', 'lastName'],
                    }]
                }
            ],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin giường thành công",
            DT: bed
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

const getBedEmpty = async () => {
    try{
        let bed = await db.Bed.findAll({
            include: [
                {
                    model: db.Room,
                    as: 'bedRoomData',
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.Department,
                        as: 'roomDepartmentData',
                        attributes: ['id'],
                    }]
                },{
                    model: db.Patient,
                    as: 'bedPatientData',
                    where: {
                        [Sequelize.Op.or]: [
                            { dateOfDischarge: { [Sequelize.Op.ne]: null } }, // Bệnh nhân đã xuất viện
                        ],
                    }
                }
            ],
            where: { 
                status: status.ACTIVE
            }, 
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin giường thành công",
            DT: bed
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

const getBedById = async (bedId) => {
    try{
        let bed = await db.Bed.findOne({
            where: { id: bedId, status: status.ACTIVE },
            include: [
                {
                    model: db.Room,
                    as: 'bedRoomData',
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.Department,
                        as: 'roomDepartmentData',
                        attributes: ['id', 'name'],
                    }]
                },
            ],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin giường thành công",
            DT: bed
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

const createBed = async (data) => {
    try {
        let bed = await db.Bed.create({
            name: data.name,
            roomId: data.roomId,
            status: status.ACTIVE,
        });
        return {
            EC: 0,
            EM: "Tạo giường thành công",
            DT: bed
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

const updateBed = async (data) => {
    try {
        let bed = await db.Bed.update({
            name: data.name,
            roomId: data.roomId,
        }, {
            where: { id: data.id },
        });
        return {
            EC: 0,
            EM: "Cập nhật giường thành công",
            DT: bed
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

const deleteBed = async (bedId) => {
    try {
        let bed = await db.Bed.update({
            status: status.INACTIVE,
        }, {
            where: { id: bedId },
        });
        return {
            EC: 0,
            EM: "Xóa giường thành công",
            DT: bed
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
    getAllBeds,
    getBedByRoom,
    getBedEmpty,
    getBedById,
    createBed,
    updateBed,
    deleteBed,
}