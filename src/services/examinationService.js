import { raw } from "body-parser";
// import { Op, Sequelize } from "sequelize";
import dayjs from "dayjs";
import db from "../models/index";
import { status, paymentStatus } from "../utils/index";
import { refundMomo } from "./paymentService";
const { Op, ConnectionTimedOutError, Sequelize, where, or } = require('sequelize');


const getExaminationById = async (id) => {
    try {
        let examination = await db.Examination.findOne({
            where: { id: +id },
            include: [
                {
                    model: db.VitalSign,
                    as: 'examinationVitalSignData',
                },
                {
                    model: db.Paraclinical,
                    as: 'examinationResultParaclincalData',
                    include: [
                        {
                            model: db.Staff,
                            as: 'doctorParaclinicalData',
                            attributes: ['id', 'departmentId'],
                            include: [{
                                model: db.User,
                                as: 'staffUserData',
                                attributes: ['id', 'lastName', 'firstName'],
                            }],
                        },
                        {
                            model: db.Room,
                            as: 'roomParaclinicalData',
                            attributes: ['id', 'name'],
                        },
                        {
                            model: db.ServiceType,
                            as: 'paraclinicalData',
                            attributes: ['id', 'name', 'price'],
                        }
                    ],
                    separate: true,
                },
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'lastName', 'firstName', 'dob', 'gender', 'phoneNumber', 'cid'],
                    include: [{
                        model: db.Insurance,
                        as: "userInsuranceData",
                        attributes: ["insuranceCode"]
                    }],
                },
                {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'departmentId'],
                    include: [{
                        model: db.User,
                        as: 'staffUserData',
                        attributes: ['id', 'lastName', 'firstName'],
                    }],
                },
                {
                    model: db.Prescription,
                    as: 'prescriptionExamData',
                    attributes: ['id', 'note', 'totalMoney', 'paymentStatus'],
                    include: [{
                        model: db.Medicine,
                        as: 'prescriptionDetails',
                        attributes: ['id', 'name', 'price'],
                        through: ['quantity', 'unit', 'dosage', 'price']
                    }],
                }
            ],
            nest: true,
        });

        return {
            EC: 0,
            EM: "Lấy thông tin khám bệnh thành công",
            DT: examination
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const getExaminationByUserId = async (userId, filter) => {
    try {
        let statusReq = filter?.status || status.ACTIVE;
        if (statusReq === status.PENDING) {
        }
        let examinations = await db.Examination.findAll({
            where: {
                [Op.or]: [
                    { userId: userId },
                    { bookFor: userId }
                ],
                is_appointment: 1,
                //status: statusReq
            },
            include: [
                {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'position', 'price'],
                    include: [
                        {
                            model: db.User,
                            as: 'staffUserData',
                            attributes: ['firstName', 'lastName']
                        },
                        {
                            model: db.Specialty,
                            as: 'staffSpecialtyData',
                            attributes: ['name']
                        }
                    ],
                },
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'cid', "phoneNumber", "currentResident", "dob"],
                    include: [{
                        model: db.Insurance,
                        as: "userInsuranceData",
                        attributes: ["insuranceCode"]
                    }],
                }
            ],
            order: [['createdAt', 'DESC']],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin khám bệnh thành công",
            DT: examinations
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

const createExamination = async (data) => {
    try {
        let staff = await db.Staff.findOne({
            where: {
                id: data.staffId
            }
        });

        if (!staff) {
            return {
                EC: 404,
                EM: "Nhân viên không tồn tại",
                DT: ""
            };
        }

        // Lấy ngày hôm nay (chỉ tính ngày, không quan tâm giờ, phút, giây)
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Đặt lại giờ để so sánh chỉ theo ngày

        // Tìm số thứ tự lớn nhất của phòng trong ngày hôm nay
        let maxNumber = await db.Examination.max('number', {
            where: {
                roomName: data.roomName,
                admissionDate: {
                    [Op.gte]: today  // Chỉ lấy các bản ghi từ ngày hôm nay trở đi
                }
            }
        });

        // Tính số thứ tự tiếp theo (nếu không có bản ghi nào, bắt đầu từ 1)
        let nextNumber = maxNumber ? maxNumber + 1 : 1;

        // Tạo bản ghi Examination mới
        let examination = await db.Examination.create({
            userId: data.userId,
            staffId: data.staffId,
            symptom: data.symptom,
            admissionDate: new Date(),
            dischargeDate: new Date(),
            status: data.status,
            paymentDoctorStatus: paymentStatus.UNPAID,

            price: staff.price,
            special: data.special,
            insuranceCoverage: data.insuranceCoverage,
            comorbidities: data.comorbidities,

            // Số vào phòng bác sĩ (number) và tên phòng (roomName)
            number: nextNumber,
            roomName: data.roomName,

            // Thông tin cho người đặt trước
            time: data.time,
            visit_status: data.visit_status ? data.visit_status : 0,
            is_appointment: data.is_appointment ? data.is_appointment : 0,
            insuaranceCode: data.insuaranceCode ? data.insuaranceCode : null,
        });

        return {
            EC: 0,
            EM: "Tạo khám bệnh thành công",
            DT: examination
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        };
    }
};
const updateExamination = async (data) => {
    try {
        let existExamination = await db.Examination.findOne({
            where: { id: data.id }
        });
        if (!existExamination) {
            return {
                EC: 404,
                EM: "Không tìm thấy khám bệnh",
                DT: ""
            }
        }

        let examination = await db.Examination.update({
            symptom: data.symptom,
            diseaseName: data.diseaseName,
            treatmentResult: data.treatmentResult,
            admissionDate: data.admissionDate,
            dischargeDate: data.dischargeDate,
            reason: data.reason,
            medicalTreatmentTier: data.medicalTreatmentTier,
            paymentDoctorStatus: data.paymentDoctorStatus,
            price: data.price,
            special: data.special,
            insuranceCoverage: data.insuranceCoverage,
            comorbidities: data.comorbidities,
            visit_status: data.visit_status ? data.visit_status : 0,
            insuaranceCode: data.insuaranceCode,
            status: data.status,
        }, {
            where: { id: data.id }
        });
        return {
            EC: 0,
            EM: "Cập nhật khám bệnh thành công",
            DT: examination
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
const deleteExamination = async (id) => {
    try {
        let existExamination = await db.Examination.findOne({
            where: { id: id },
            include: [
                {
                    model: db.Payment,
                    as: "paymentData",
                }
            ],
            raw: true,
            nest: true,
        });
        if (!existExamination) {
            return {
                EC: 404,
                EM: "Không tìm thấy khám bệnh",
                DT: ""
            }
        }
        if (existExamination.status !== status.PENDING || dayjs(existExamination.admissionDate).isBefore(dayjs().add(1, 'day').startOf('day'))) {
            return {
                EC: 400,
                EM: "Không thể hủy lịch hẹn",
                DT: ""
            }
        }
        if (existExamination.paymentDoctorStatus === status.PAID && existExamination.paymentId) {
            let refund = await refundMomo({ transId: existExamination.paymentData.transId, amount: existExamination.paymentData.amount * 0.8 });
            if (refund.EC !== 0) {
                return {
                    EC: 400,
                    EM: "Không thể hủy lịch hẹn",
                    DT: ""
                }
            } else {
                await db.Payment.update({
                    status: status.INACTIVE,
                    paymentDoctorStatus: paymentStatus.UNPAID,
                }, {
                    where: { id: existExamination.paymentData.id }
                })
            }
        }
        await db.Examination.update({
            status: status.INACTIVE,
        }, {
            where: { id: id }
        })
        return {
            EC: 0,
            EM: "Hủy lịch hẹn thành công",
            DT: ""
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
const getExaminations = async (date, status, staffId, page, limit, search, time) => {
    try {
        const whereCondition = {};

        // Date filter
        if (date) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Bắt đầu ngày
            const endOfDay = new Date(date).setHours(23, 59, 59, 999); // Kết thúc ngày

            whereCondition.admissionDate = {
                [Op.between]: [startOfDay, endOfDay],
            };
        }

        const totalPatient = await db.Examination.count({
            where: {
                ...whereCondition,
                status: { [Op.gte]: 4 },
            }
        });

        const totalAppointment = await db.Examination.count({
            where: {
                ...whereCondition,
                //is_appointment: 1,
                status: 2,
            }
        });

        // Staff ID filter
        if (staffId) {
            whereCondition.staffId = staffId;
        }

        // Status filter
        if (status) {
            whereCondition.status = status;
        }
        // Appointment filter
        // if (is_appointment) {
        //     whereCondition.is_appointment = is_appointment;
        // }

        // Time filter
        if (time) {
            whereCondition.time = time;
        }

        // Search filter (across user's first and last name)
        const searchCondition = search ? {
            [Op.or]: [
                { '$userExaminationData.firstName$': { [Op.like]: `%${search}%` } },
                { '$userExaminationData.lastName$': { [Op.like]: `%${search}%` } }
            ]
        } : {};

        let offset, limit_query;
        if (status === 2) {
            // Nếu status là 2, không phân trang
            offset = 0;
            limit_query = null;
        } else {
            offset = (page - 1) * limit;
            limit_query = limit;
        }

        const { count, rows: examinations } = await db.Examination.findAndCountAll({
            where: {
                ...whereCondition,
                ...searchCondition
            },
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'cid'],
                    include: [{
                        model: db.Insurance,
                        as: "userInsuranceData",
                        attributes: ["insuranceCode"]
                    }],
                    // Add search condition to include
                    where: search ? {
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${search}%` } },
                            { lastName: { [Op.like]: `%${search}%` } }
                        ]
                    } : {}
                },
                {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'position', 'price'],
                    include: [
                        {
                            model: db.User,
                            as: 'staffUserData',
                            attributes: ['firstName', 'lastName']
                        },
                    ],
                },
            ],
            limit: limit_query,
            offset,
            order: [
                [
                    Sequelize.literal(
                        `CASE 
                            WHEN special IN ('old', 'children', 'disabled', 'pregnant') THEN 1 
                            WHEN special = 'normal' THEN 2 
                            ELSE 3 
                        END`
                    ),
                    'ASC'
                ],
                ['visit_status', 'ASC'],
                ['createdAt', 'ASC']],
            distinct: true // Ensures correct count with joins
        });

        return {
            EC: 0,
            EM: 'Lấy danh sách khám bệnh thành công!',
            DT: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                totalPatient: totalPatient,
                totalAppointment: totalAppointment,
                examinations: examinations,

            },
        };
    } catch (error) {
        console.error('Error fetching examinations:', error);
        return {
            EC: 500,
            EM: 'Lỗi server!',
            DT: '',
        };
    }
};
const getScheduleApoinment = async (filter) => {
    try {
        let listDate = filter?.date || [];
        const results = await db.Examination.findAll({
            attributes: [
                [Sequelize.literal("DATE(admissionDate)"), "date"], // Lấy phần ngày từ `createdAt`
                "time",
                [Sequelize.fn("COUNT", Sequelize.col("time")), "count"], // Đếm số lần xuất hiện của mỗi `time`
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.literal("DATE(admissionDate)"), { [Op.in]: listDate }), // So sánh phần ngày của `createdAt`
                    { is_appointment: 1 }, // Chỉ lấy các bản ghi đã hẹn
                    { status: status.PENDING },
                ],
            },
            group: ["date", "time"], // Nhóm theo ngày và time
            raw: true, // Trả về kết quả dạng thô
        });
        return {
            EC: 0,
            EM: "Lấy dữ liệu thành công",
            DT: results,
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        }
    }
}

const getListToPay = async (date, statusPay, page, limit, search) => {
    try {
        // Prepare base where conditions
        const whereConditionExamination = {};
        const whereConditionParaclinical = {};

        // Date filter
        if (date) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Start of day
            const endOfDay = new Date(date).setHours(23, 59, 59, 999); // End of day

            whereConditionExamination.admissionDate = {
                [Op.between]: [startOfDay, endOfDay],
            };
            whereConditionParaclinical.createdAt = {
                [Op.between]: [startOfDay, endOfDay],
            };
        }

        // Status filter
        if (statusPay <= 4) {
            whereConditionExamination.status = statusPay;
            whereConditionParaclinical.status = statusPay;
        } else if (statusPay > 4) {
            whereConditionExamination.status = { [Op.gte]: statusPay };
            whereConditionParaclinical.status = { [Op.gte]: statusPay };
        }

        // Pagination
        // const pageNum = page || 1;
        // const limitNum = limit || 10;
        // const offset = (pageNum - 1) * limitNum;

        // Fetch data with associations
        const examinations = await db.Examination.findAll({
            where: whereConditionExamination,
            attributes: ['id', 'userId', 'staffId', 'price', 'insuranceCoverage', 'insuaranceCode', 'symptom', 'roomName', 'visit_status', 'special', 'createdAt'],
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'cid'],
                    // Add search condition to include
                    where: search ? {
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${search}%` } },
                            { lastName: { [Op.like]: `%${search}%` } }
                        ]
                    } : {},
                    include: [{
                        model: db.Insurance,
                        as: "userInsuranceData",
                        attributes: ["insuranceCode"]
                    }]
                },
                {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'position', 'price'],
                    include: [
                        {
                            model: db.User,
                            as: 'staffUserData',
                            attributes: ['firstName', 'lastName']
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']]
        });

        const paraclinicals = await db.Paraclinical.findAll({
            where: whereConditionParaclinical,
            attributes: ['id', 'examinationId', 'doctorId', 'roomId', 'paraclinical', 'paracName', 'price', 'status', 'createdAt'],
            include: [
                {
                    model: db.Examination,
                    as: 'examinationResultParaclincalData',
                    attributes: ['id', 'symptom', 'insuranceCoverage', 'insuaranceCode', 'special', 'visit_status'],
                    include: [
                        {
                            model: db.User,
                            as: 'userExaminationData',
                            attributes: ['id', 'firstName', 'lastName', 'email', 'cid'],
                            include: [
                                {
                                    model: db.Insurance,
                                    as: 'userInsuranceData',
                                    attributes: ['insuranceCode'],
                                },
                            ],
                            where: search ? {
                                [Op.or]: [
                                    { firstName: { [Op.like]: `%${search}%` } },
                                    { lastName: { [Op.like]: `%${search}%` } }
                                ]
                            } : {},
                            required: true,
                        },
                    ],
                    required: true,
                },
                {
                    model: db.Staff,
                    as: 'doctorParaclinicalData',
                    attributes: ['id', 'position', 'price'],
                    include: [
                        {
                            model: db.User,
                            as: 'staffUserData',
                            attributes: ['firstName', 'lastName'],
                        },
                    ],
                },
                {
                    model: db.Room,
                    as: 'roomParaclinicalData',
                    attributes: ['id', 'name'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        // Combine and sort the lists
        const combinedList = [
            ...examinations.map(exam => ({
                type: 'examination',
                data: { ...exam.toJSON(), status: statusPay },
                createdAt: exam.createdAt,
                userName: exam.userExaminationData.firstName + ' ' + exam.userExaminationData.lastName,
                userPhone: exam.userExaminationData.phoneNumber,
            })),
            // Nhóm paraclinicals theo examinationId
            ...Object.values(
                paraclinicals.reduce((acc, parac) => {
                    const examinationId = parac.examinationId;
                    if (!acc[examinationId]) {
                        acc[examinationId] = {
                            type: 'paraclinical',
                            data: {
                                ...parac.examinationResultParaclincalData.toJSON(),
                                paraclinicalItems: [],
                                status: statusPay,
                                totalParaclinicalPrice: 0
                            },
                            createdAt: parac.createdAt,
                            userName: parac.examinationResultParaclincalData.userExaminationData.lastName +
                                ' ' +
                                parac.examinationResultParaclincalData.userExaminationData.firstName,
                            userPhone: parac.examinationResultParaclincalData.userExaminationData.phoneNumber
                        };
                    }

                    // Thêm thông tin chi tiết của từng paraclinical vào mảng paraclinicalItems
                    const paracItem = {
                        id: parac.id,
                        paraclinical: parac.paraclinical,
                        paracName: parac.paracName,
                        price: parac.price,
                        status: parac.status,
                        doctorInfo: {
                            id: parac.doctorParaclinicalData.id,
                            position: parac.doctorParaclinicalData.position,
                            doctorName: parac.doctorParaclinicalData.staffUserData.lastName +
                                ' ' +
                                parac.doctorParaclinicalData.staffUserData.firstName
                        },
                        roomInfo: {
                            id: parac.roomParaclinicalData.id,
                            name: parac.roomParaclinicalData.name
                        }
                    };

                    acc[examinationId].data.paraclinicalItems.push(paracItem);

                    // Cộng dồn tổng giá
                    acc[examinationId].data.totalParaclinicalPrice += parac.price;

                    return acc;
                }, {})
            )
        ];

        // Sắp xếp lại danh sách
        const sortedList = combinedList.sort((itemA, itemB) => {
            const dateA = new Date(itemA.createdAt);
            const dateB = new Date(itemB.createdAt);
            return dateB.getTime() - dateA.getTime(); // Mới nhất lên đầu
        });

        // Áp dụng phân trang
        const totalItems = sortedList.length;
        const pageNum = page || 1;
        const limitNum = limit || 10;
        const offset = (pageNum - 1) * limitNum;
        const paginatedList = sortedList.slice(offset, offset + limitNum);

        return {
            EC: 0,
            EM: 'Lấy danh sách thành công',
            DT: {
                list: paginatedList,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    totalItems: totalItems
                }
            }
        };

    } catch (error) {
        console.error('Error fetching examinations and paraclinicals:', error);
        return {
            EC: 500,
            EM: 'Lỗi server!',
            DT: '',
        };
    }
};

module.exports = {
    getExaminationById,
    getExaminationByUserId,
    createExamination,
    updateExamination,
    deleteExamination,
    getExaminations,
    getListToPay,
    getScheduleApoinment,
}