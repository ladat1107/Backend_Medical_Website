import db from "../models/index";
import { department, ROLE, status, typeRoom } from "../utils";
const { Op } = require('sequelize');

const getAllSchedules = async () => {
    try {
        let schedule = await db.Schedule.findAll({
            include: [{
                model: db.Staff,
                as: 'staffScheduleData',
                attributes: ['id', 'departmentId'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['id', 'lastName', 'firstName'],
                }],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin lịch trực thành công",
            DT: schedule
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
const getScheduleByStaffId = async (staffId) => {
    try {
        let schedule = await db.Schedule.findAll({
            where: { staffId: staffId },
            attributes: ['roomId', 'date'],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin lịch trực thành công",
            DT: schedule
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
const getScheduleInWeek = async (data) => {
    try {
        let schedule = await db.Schedule.findAll({
            where: {
                date: {
                    [Op.gte]: +data.from,
                    [Op.lte]: +data.to,
                }
            },
            include: [{
                model: db.Staff,
                as: 'staffScheduleData',
                attributes: ['id', 'departmentId'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['id', 'lastName', 'firstName'],
                }],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin lịch trực thành công",
            DT: schedule
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
const createSchedule = async (data) => {
    let transaction = await db.sequelize.transaction();
    try {
        await db.Schedule.destroy({
            where: {
                date: new Date(data[0].date),
                roomId: data[0].roomId,
            },
            transaction,
        });
        // Lấy danh sách lịch trực đã tồn tại trong database theo roomId và date
        const existingSchedules = await db.Schedule.findAll({
            where: {
                date: new Date(data[0].date), // Giá trị ngày cần tìm
                staffId: {
                    [Op.in]: data.map(item => item.staffId), // Lấy danh sách staffId từ mảng `data`
                },
            },
            include: [
                {
                    model: db.Staff, // Model liên kết với Schedule
                    as: 'staffScheduleData', // Alias trong association
                    include: [
                        {
                            model: db.User, // Model User liên kết với Staff
                            as: 'staffUserData', // Alias trong association
                            attributes: ['lastName', 'firstName'], // Lấy thông tin tên nhân viên
                        },
                    ],
                },
            ],
            raw: true,
            nest: true,
            transaction,
        });
        if (existingSchedules.length > 0) {
            await transaction.rollback();
            let name = 'Trùng lịch trực: \n';
            for (let i = 0; i < existingSchedules.length; i++) {
                name += existingSchedules[i].staffScheduleData.staffUserData.lastName + ' ' + existingSchedules[i].staffScheduleData.staffUserData.firstName + '\n';
            }
            return {
                EC: 2,
                EM: name,
                DT: '',
            };
        }
        //Thêm dữ liệu mới
        let schedule = await db.Schedule.bulkCreate(data, { transaction });
        await transaction.commit();
        return {
            EC: 0,
            EM: "Tạo thông tin lịch trực thành công",
            DT: schedule,
        };
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        };
    }
};
const updateScheduleStaff = async (data) => {
    try {
        let schedule = await db.Schedule.update({
            staffId: data.newStaffId
        }, {
            where: { roomId: data.roomId, staffId: data.oldStaffId, date: data.date },
        });
        return {
            EC: 0,
            EM: "Cập nhật thông tin lịch trực thành công",
            DT: schedule
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
const deleteSchedule = async (data) => {
    try {
        let schedule = await db.Schedule.destroy({
            where: { staffId: data.staffId, roomId: data.roomId, date: data.date },
        });
        return {
            EC: 0,
            EM: "Xóa thông tin lịch trực thành công",
            DT: schedule
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
const arrangeSchedule = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {
        let doctorNedeed = data?.doctorNedeed || 1;
        let nurseNedeed = data?.nurseNedeed || 1;
        const start = new Date(data?.startDate); // Hôm nay
        start.setHours(0, 0, 0, 0); // Đầu ngày: 00:00:00
        const end = new Date(start); // Sao chép từ `start`
        end.setDate(start.getDate() + 30); // Thêm 30 ngày
        end.setHours(23, 59, 59, 999); // Cuối ngày: 23:59:59
        // Xóa lịch trực
        await db.Schedule.destroy({
            where: {
                date: { [Op.between]: [start, end] }, // So sánh khoảng ngày
            },
            transaction,
        });
        // Tạo danh sách các ngày
        const dates = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d)); // Thêm từng ngày vào danh sách
        }

        // Lấy danh sách phòng
        const rooms = await db.Room.findAll({
            where: { status: status.ACTIVE },
            include: [
                {
                    model: db.ServiceType,
                    as: 'serviceData',
                    attributes: ['id', 'name'],
                    where: { id: { [Op.in]: [typeRoom.CLINIC, typeRoom.DUTY] }, status: status.ACTIVE },
                    through: { attributes: [] },
                },
            ],
            attributes: ['id', 'departmentId', 'medicalExamination'],
            transaction,
        });

        // Lấy danh sách bác sĩ và điều dưỡng
        const doctors = await db.Staff.findAll({
            where: { status: status.ACTIVE },
            include: [
                {
                    model: db.User,
                    as: 'staffUserData',
                    where: { roleId: ROLE.DOCTOR, status: status.ACTIVE },
                    attributes: [],
                },
            ],
            attributes: ['id', 'departmentId', 'specialtyId'],
            transaction,
        });

        const nurses = await db.Staff.findAll({
            where: { status: status.ACTIVE },
            include: [
                {
                    model: db.User,
                    as: 'staffUserData',
                    where: { roleId: ROLE.NURSE, status: status.ACTIVE },
                    attributes: [],
                },
            ],
            attributes: ['id', 'departmentId'],
            transaction,
        });

        // Nếu không đủ nhân viên
        if (doctors.length === 0 || nurses.length === 0) {
            return { EC: 400, EM: 'Không đủ nhân viên', DT: '' };
        }

        const doctorIndexTracker = {}; // Đánh dấu vị trí bác sĩ
        const nurseIndexTracker = {}; // Đánh dấu vị trí điều dưỡng
        let schedule = [];

        for (const shiftDate of dates) {
            const usedDoctors = new Set(); // Bác sĩ đã trực trong ngày
            const usedNurses = new Set(); // Điều dưỡng đã trực trong ngày
            for (const room of rooms) {
                const requiredDoctors = room.departmentId === department.CLINIC ? 1 : doctorNedeed; // Khoa khám bệnh cần 1 bác sĩ
                const requiredNurses = room.departmentId === department.CLINIC ? 1 : nurseNedeed; // Khoa khám bệnh cần 1 điều dưỡng

                const doctorsForRoom =
                    room.departmentId === department.CLINIC // && shiftDate.getDay() !== 0 && shiftDate.getDay() !== 6
                        ? doctors.filter(
                            (doctor) =>
                                doctor.specialtyId === room.medicalExamination &&
                                !usedDoctors.has(doctor.id)
                        )
                        : doctors.filter(
                            (doctor) =>
                                doctor.departmentId === room.departmentId &&
                                !usedDoctors.has(doctor.id)
                        );

                const nursesForRoom =
                    room.departmentId === department.CLINIC
                        ? nurses.filter(
                            (nurse) =>
                                nurse.departmentId === department.CLINIC &&
                                !usedNurses.has(nurse.id)
                        )
                        : nurses.filter(
                            (nurse) =>
                                nurse.departmentId === room.departmentId &&
                                !usedNurses.has(nurse.id)
                        );

                if (doctorsForRoom.length < requiredDoctors) {
                    continue;
                } else {
                    // Chọn bác sĩ
                    for (let i = 0; i < requiredDoctors; i++) {
                        const doctorIndex =
                            (doctorIndexTracker[room.id] || 0) % doctorsForRoom.length;
                        const doctor = doctorsForRoom[doctorIndex];
                        usedDoctors.add(doctor.id);
                        doctorIndexTracker[room.id] = doctorIndex + 1;

                        //schedule += `${formatDate(shiftDate)}: Bác sĩ [ ${doctor.staffUserData.lastName} ${doctor.staffUserData.firstName} CK: ${doctor.specialtyId}] `;
                        schedule.push({
                            date: shiftDate,
                            staffId: doctor.id,
                            roomId: room.id,
                        })
                    }
                }

                if (nursesForRoom.length < requiredNurses) {
                    continue;
                } else {
                    // Chọn điều dưỡng
                    for (let i = 0; i < requiredNurses; i++) {
                        const nurseIndex =
                            (nurseIndexTracker[room.id] || 0) % nursesForRoom.length;
                        const nurse = nursesForRoom[nurseIndex];
                        usedNurses.add(nurse.id);
                        nurseIndexTracker[room.id] = nurseIndex + 1;

                        // schedule += `- Điều dưỡng [ ${nurse.staffUserData.lastName} ${nurse.staffUserData.firstName} Khoa: ${nurse.departmentId}] `;
                        schedule.push({
                            date: shiftDate,
                            staffId: nurse.id,
                            roomId: room.id,
                        })
                    }
                }
            }
        }
        await db.Schedule.bulkCreate(schedule, { transaction });
        await transaction.commit();
        return { EC: 0, EM: 'Xếp lịch trực thành công', DT: { schedule } };
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return { EC: 500, EM: 'Lỗi server!', DT: '' };
    }
};
const getAllSchedulesAdmin = async (filter) => {
    try {
        let condition = {};
        let listStaff;
        if (filter.date && filter.roomId) {
            condition = { ...condition, date: filter.date, roomId: filter.roomId }
            let scheduleStaff = await db.Schedule.findAll({
                where: {
                    date: filter.date,
                    roomId: {
                        [Op.ne]: filter.roomId,
                    }
                },
                attributes: ['staffId'],
                raw: true,
            });
            const excludedStaffIds = Array.isArray(scheduleStaff)
                ? scheduleStaff.map(item => item.staffId)
                : [];
            let roomFind = await db.Room.findOne({
                where: { id: filter.roomId },
                raw: true,
            });
            if (roomFind.departmentId === department.CLINIC) {
                listStaff = await db.Staff.findAll({
                    where: {
                        status: status.ACTIVE,
                        [Op.or]: [
                            { specialtyId: roomFind.medicalExamination, },
                            { departmentId: roomFind.departmentId }
                        ],
                        id: {
                            [Op.notIn]: excludedStaffIds,
                        },
                    },
                    include: [{
                        model: db.User,
                        as: 'staffUserData',
                        attributes: ['id', 'lastName', 'firstName', "roleId"],
                        raw: true,
                    }],
                    attributes: ['id',],
                    raw: true,
                    nest: true,
                })
            } else {
                listStaff = await db.Room.findOne({
                    where: { id: filter.roomId },
                    include: [{
                        model: db.Department,
                        as: 'roomDepartmentData',
                        attributes: ['id', "name"],
                        include: [{
                            model: db.Staff,
                            where: {
                                status: status.ACTIVE,
                                id: {
                                    [Op.notIn]: excludedStaffIds,
                                },
                            },
                            as: 'staffDepartmentData',
                            attributes: ['id'],
                            include: [{
                                model: db.User,
                                where: {
                                    status: status.ACTIVE,
                                    roleId: {
                                        [Op.in]: [ROLE.DOCTOR, ROLE.NURSE]
                                    }
                                },
                                as: 'staffUserData',
                                attributes: ['id', 'lastName', 'firstName', "roleId"],
                                raw: true,
                            }],

                        }]
                    }],
                    raw: false,
                    nest: true,
                })
            }
        }
        if (filter.startDate) {
            let startDate = new Date(filter.startDate);
            let endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7);
            condition = {
                ...condition, date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        }
        let schedule = await db.Schedule.findAll({
            where: condition,
            include: [{
                model: db.Staff,
                as: 'staffScheduleData',
                attributes: ['id', 'departmentId', 'specialtyId'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['id', 'lastName', 'firstName', "roleId"],
                    raw: false,
                }],
                raw: true,
            }],
            nest: true,
        });
        let dataRes = {
            schedule,
            listStaff
        }
        return {
            EC: 0,
            EM: "Lấy thông tin lịch trực thành công",
            DT: dataRes
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
    getAllSchedulesAdmin,
    getAllSchedules,
    getScheduleByStaffId,
    getScheduleInWeek,
    createSchedule,
    updateScheduleStaff,
    deleteSchedule,
    arrangeSchedule,
}