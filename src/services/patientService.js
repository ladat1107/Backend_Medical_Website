import db from "../models/index";

const getAllPatients = async () => {
    try {
        let patient = await db.Patient.findAll({
            include: [
                {
                    model: db.User,
                    as: 'patientUserData',
                    attributes: ['id', 'firstName', 'lastName'],
                }, {
                    model: db.Bed,
                    as: 'bedPatientData',
                    attributes: ['id'],
                    include: [{
                        model: db.Room,
                        as: 'bedRoomData',
                        attributes: ['id', 'name'],
                        include: [{
                            model: db.Department,
                            as: 'roomDepartmentData',
                            attributes: ['id'],
                        }]
                    }]
                }
            ],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin bệnh nhân thành công",
            DT: patient
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

const getPatientById = async (patientId) => {
    try {
        let patient = await db.Patient.findOne({
            where: { id: patientId },
            include: [
                {
                    model: db.User,
                    as: 'patientUserData',
                    attributes: ['id', 'firstName', 'lastName'],
                }, {
                    model: db.Bed,
                    as: 'bedPatientData',
                    attributes: ['id'],
                    include: [{
                        model: db.Room,
                        as: 'bedRoomData',
                        attributes: ['id', 'name'],
                        include: [{
                            model: db.Department,
                            as: 'roomDepartmentData',
                            attributes: ['id'],
                        }]
                    }]
                }
            ],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin bệnh nhân thành công",
            DT: patient
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

const getPatientByUserId = async (userId) => {
    try {
        let patient = await db.Patient.findOne({
            where: { userId: userId },
            include: [
                {
                    model: db.User,
                    as: 'patientUserData',
                    attributes: ['id', 'firstName', 'lastName'],
                }, {
                    model: db.Bed,
                    as: 'bedPatientData',
                    attributes: ['id'],
                    include: [{
                        model: db.Room,
                        as: 'bedRoomData',
                        attributes: ['id', 'name'],
                        include: [{
                            model: db.Department,
                            as: 'roomDepartmentData',
                            attributes: ['id'],
                        }]
                    }]
                }
            ],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin bệnh nhân thành công",
            DT: patient
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

const createPatient = async (data) => {
    try {
        let patient = await db.Patient.create({
            dateOfAdmission: data.dateOfAdmission,
            bedId: data.bedId,
            userId: data.userId,
        });
        return {
            EC: 0,
            EM: "Tạo bệnh nhân thành công",
            DT: patient
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

const updatePatient = async (data) => {
    try {
        let patient = await db.Patient.update({
            dateOfAdmission: data.dateOfAdmission,
            dateOfDischarge: data.dateOfDischarge,
            bedId: data.bedId,
        }, {
            where: { id: data.id },
        });
        return {
            EC: 0,
            EM: "Cập nhật bệnh nhân thành công",
            DT: patient
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
    getAllPatients,
    getPatientById,
    getPatientByUserId,
    createPatient,
    updatePatient,
}