import dayjs from "dayjs";
import db from "../models/index";
import { status, paymentStatus, ERROR_SERVER } from "../utils/index";
import { refundMomo } from "./paymentService";
import { Op, Sequelize } from 'sequelize';
import { getThirdDigitFromLeft } from "../utils/getbenefitLevel";
import { getStaffForReExamination } from "./scheduleService";

export const getExaminationById = async (id) => {
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
                    include: [{
                        model: db.Insurance,
                        as: "userInsuranceData",
                        attributes: ["insuranceCode"]
                    }],
                },
                {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'departmentId', 'position'],
                    include: [{
                        model: db.User,
                        as: 'staffUserData',
                        attributes: ['id', 'lastName', 'firstName'],
                    }],
                },
                {
                    model: db.Prescription,
                    as: 'prescriptionExamData',
                    attributes: ['id', 'note', 'totalMoney'],
                    include: [{
                        model: db.Medicine,
                        as: 'prescriptionDetails',
                        attributes: ['id', 'name', 'price'],
                        through: ['quantity', 'unit', 'dosage', 'price', 'session', 'dose', 'coveredPrice']
                    }],
                },
                {
                    model: db.Room,
                    as: 'examinationRoomData',
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.Department,
                        as: 'roomDepartmentData',
                        attributes: ['id', 'name'],
                    },{
                        model: db.ServiceType,
                        as: 'serviceData',
                        attributes: ['id', 'name', 'price'],
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
        return ERROR_SERVER
    }
}
export const getExaminationByUserId = async (userId, filter) => {
    try {
        let statusReq = filter?.status || status.ACTIVE;
        if (statusReq === status.PENDING) {
            //Chả nhớ
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
        return ERROR_SERVER
    }
}
export const createExamination = async (data) => {
    // Initialize transaction
    const transaction = await db.sequelize.transaction();
    
    try {
        let staff = await db.Staff.findOne({
            where: {
                id: data.staffId
            },
            transaction
        });

        // if (!staff) {
        //     await transaction.rollback();
        //     return {
        //         EC: 404,
        //         EM: "Nhân viên không tồn tại",
        //         DT: ""
        //     };
        // }

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
            },
            transaction
        });

        let paymentObject = {};
        if (data.insuranceCode) {

            // Update thông tin bảo hiểm từ TIẾP NHẬN
            let existingInsurance = await db.Insurance.findOne({
                where: { userId: +data.userId },
                transaction
            });

            if (existingInsurance) {
                // Cập nhật bản ghi đã tồn tại
                if (existingInsurance.insuranceCode !== data.insuranceCode) {
                    existingInsurance = await existingInsurance.update({
                        insuranceCode: data.insuranceCode,
                        benefitLevel: getThirdDigitFromLeft(data.insuranceCode)
                    }, { transaction });
                }
            } else {
                // Thêm mới nếu chưa có
                existingInsurance = await db.Insurance.create({
                    insuranceCode: data.insuranceCode,
                    benefitLevel: getThirdDigitFromLeft(data.insuranceCode),
                    userId: data.userId
                }, { transaction });
            }

            if (!existingInsurance) {
                await transaction.rollback();
                return {
                    EC: 404,
                    EM: "Không tìm thấy bảo hiểm",
                    DT: ""
                }
            }

            paymentObject = {
                insuranceCode: data.insuranceCode,
                insuranceCoverage: getThirdDigitFromLeft(data.insuranceCode),
                ...(data.insuranceCovered !== undefined && { insuranceCovered: data.insuranceCovered }),
                ...(data.coveredPrice !== undefined && { coveredPrice: data.coveredPrice })
            }
        }

        // Tính số thứ tự tiếp theo (nếu không có bản ghi nào, bắt đầu từ 1)
        let nextNumber = maxNumber ? maxNumber + 1 : 1;

        // Tạo bản ghi Examination mới
        let examination = await db.Examination.create({
            userId: data.userId,
            staffId: data.staffId || null,
            symptom: data.symptom,
            admissionDate: data.admissionDate || new Date(),
            dischargeDate: data.dischargeDate,
            status: data.status,

            price: staff ? staff?.price : null,
            special: data.special,
            comorbidities: data.comorbidities,

            // Số vào phòng bác sĩ (number) và tên phòng (roomName)
            number: nextNumber,
            roomName: data.roomName,
            roomId: data.roomId || null,

            // Thông tin cho người đặt trước
            time: data.time,
            visit_status: data.visit_status ? data.visit_status : 0,
            is_appointment: data.is_appointment ? data.is_appointment : 0,
            oldParaclinical: data?.oldParaclinical || null,

            isWrongTreatment: data.isWrongTreatment || 0,
            medicalTreatmentTier: data.medicalTreatmentTier || null,

            ...paymentObject
        }, { transaction });

        //Tạo thanh toán tạm ứng
        if(+data.medicalTreatmentTier === 1){
            await db.AdvanceMoney.create({
                exam_id: examination.id,
                date: new Date(),
                status: status.ACTIVE,
            }, { transaction });
        }

        // Commit transaction if all operations are successful
        await transaction.commit();

        return {
            EC: 0,
            EM: "Tạo khám bệnh thành công",
            DT: examination
        };
    } catch (error) {
        // Rollback transaction if any operation fails
        await transaction.rollback();
        console.log(error);
        return ERROR_SERVER;
    }
};
export const updateExamination = async (data, userId) => {
    // Initialize transaction
    const transaction = await db.sequelize.transaction();
    
    try {
        let paymentObject = {};
        let existExamination = await db.Examination.findOne({
            where: { id: data.id },
            transaction
        });
        
        if (!existExamination) {
            await transaction.rollback();
            return {
                EC: 404,
                EM: "Không tìm thấy khám bệnh",
                DT: ""
            }
        }
        
        if (data.payment) {
            let payment = await db.Payment.create({
                orderId: new Date().toISOString() + "_UserId__" + userId,
                transId: existExamination.id,
                amount: data.advanceId ? data.advanceMoney :  existExamination.price,
                paymentMethod: data.payment,
                status: paymentStatus.PAID,
            }, { transaction });
            
            paymentObject = {
                paymentId: payment.id,
            }
        }

        if (data.insuranceCode) {
            // Update thông tin bảo hiểm từ TIẾP NHẬN
            let existingInsurance = await db.Insurance.findOne({
                where: { userId: userId },
                transaction
            });

            if (existingInsurance) {
                // Cập nhật bản ghi đã tồn tại
                if (existingInsurance.insuranceCode !== data.insuranceCode) {
                    existingInsurance = await existingInsurance.update({
                        insuranceCode: data.insuranceCode,
                        benefitLevel: getThirdDigitFromLeft(data.insuranceCode)
                    }, { transaction });
                }
            } else {
                // Thêm mới nếu chưa có
                existingInsurance = await db.Insurance.create({
                    insuranceCode: data.insuranceCode,
                    benefitLevel: getThirdDigitFromLeft(data.insuranceCode),
                    userId: userId
                }, { transaction });
            }

            if (!existingInsurance) {
                await transaction.rollback();
                return {
                    EC: 404,
                    EM: "Không tìm thấy bảo hiểm",
                    DT: ""
                }
            }

            paymentObject = {
                insuranceCode: data.insuranceCode,
                insuranceCoverage: getThirdDigitFromLeft(data.insuranceCode),
                ...(data.insuranceCovered !== undefined && { insuranceCovered: data.insuranceCovered }),
                ...(data.coveredPrice !== undefined && { coveredPrice: data.coveredPrice })
            }
        }

        let examination = await db.Examination.update({
            symptom: data.symptom,
            diseaseName: data.diseaseName,
            treatmentResult: data.treatmentResult,
            admissionDate: data.admissionDate,
            dischargeDate: data.dischargeDate,
            reason: data.reason,
            price: data.price,
            special: data.special,
            comorbidities: data.comorbidities,
            status: data.status,

            ...(data.visit_status != null && { visit_status: data.visit_status }),
            ...(data.reExaminationDate != null && { reExaminationDate: data.reExaminationDate }),
            ...(data.dischargeStatus != null && { dischargeStatus: data.dischargeStatus }),
            ...(data.time != null && { reExaminationTime: data.time }),
            ...(data.roomName != null && { roomName: data.roomName }),
            ...(data.roomId != null && { roomId: data.roomId }),
            ...(data.isWrongTreatment != null && { isWrongTreatment: data.isWrongTreatment }),
            ...(data.medicalTreatmentTier !== undefined && { medicalTreatmentTier: data.medicalTreatmentTier }), // Chỉ cập nhật nếu có giá trị mới

            ...paymentObject
        }, {
            where: { id: data.id },
            transaction
        });

        //Thanh toán tạm ứng
        if(data.advanceId){
            await db.AdvanceMoney.update({
                amount: data?.advanceMoney || 0,
                status: paymentStatus.PAID,
            }, {
                where: { id: data.advanceId },
                transaction
            });
        } else if(existExamination && existExamination.medicalTreatmentTier !== +data.medicalTreatmentTier){
            if(+data.medicalTreatmentTier === 1){
                await db.AdvanceMoney.create({
                    exam_id: existExamination.id,
                    date: new Date(),
                    status: paymentStatus.PENDING,
                }, { transaction });
            } else if (existExamination.medicalTreatmentTier === 1 && +data.medicalTreatmentTier === 2) {
                await db.AdvanceMoney.delete({
                    where: { exam_id: existExamination.id },
                    transaction
                })
            }
        }

        if(examination && data.dischargeStatus === 4 && data.reExaminationDate && data.createReExamination){
            const st = await getStaffForReExamination(existExamination.staffId, data.reExaminationDate);

            const insuranceCode = await db.Insurance.findOne({
                where: { userId: existExamination.userId },
                attributes: ['insuranceCode'],
                transaction
            });
            
            const reExam = await db.Examination.findOne({
                where: {
                    parentExaminationId: existExamination.id,
                },
                transaction
            });

            //console.log("Lịch tái khám", reExam);

            if (reExam) {
                await db.Examination.update({
                    staffId: st ? st.staffId : null,
                    admissionDate: data.reExaminationDate,
                    dischargeDate: data.reExaminationDate,
                    reason: 'Tái khám theo lịch hẹn',
                    time: data.time,
                    roomName: st ? st.scheduleRoomData.name : null,
                    price: st ? st?.staffScheduleData.price : null,
                }, {
                    where: { id: reExam.id },
                    transaction
                });
            } else {
                await db.Examination.create({
                    userId: existExamination.userId,
                    staffId: st ? st.staffId : null,
                    symptom: existExamination.symptom,
                    admissionDate: data.reExaminationDate,
                    dischargeDate: data.reExaminationDate,
                    reason: 'Tái khám theo lịch hẹn',
                    status: status.PENDING,
                    price: st ? st?.staffScheduleData.price : null,
                    special: existExamination.special,
                    comorbidities: existExamination.comorbidities,

                    insuranceCode: insuranceCode.insuranceCode,
                    insuranceCoverage: getThirdDigitFromLeft(insuranceCode.insuranceCode),

                    // Số vào phòng bác sĩ (number) và tên phòng (roomName)
                    //number: existExamination.number + 1,
                    roomName: st ? st.scheduleRoomData.name : null,

                    // Thông tin cho người đặt trước
                    time: data.time,
                    visit_status: 0,
                    is_appointment: 1,
                    parentExaminationId: existExamination.id,
                }, { transaction });
            }
        }

        // Commit transaction if all operations are successful
        await transaction.commit();

        return {
            EC: 0,
            EM: "Cập nhật khám bệnh thành công",
            DT: examination
        }
    } catch (error) {
        // Rollback transaction if any operation fails
        await transaction.rollback();
        console.log(error);
        return ERROR_SERVER;
    }
}
export const deleteExamination = async (id) => {
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
        if (existExamination.paymentId) {
            let refund = await refundMomo({ transId: existExamination.paymentData.transId, amount: existExamination.paymentData.amount * 0.8 });
            if (refund.EC !== 0) {
                return {
                    EC: 400,
                    EM: "Không thể hủy lịch hẹn",
                    DT: ""
                }
            } else {
                await db.Payment.update({
                    status: paymentStatus.UNPAID,
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
        return ERROR_SERVER
    }
}
export const getExaminations = async (date, toDate, status, staffId, page, limit, search, time) => {
    try {
        const whereCondition = {};

        // Date filter
        if (date && toDate) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Bắt đầu ngày
            const endOfDay = new Date(toDate).setHours(23, 59, 59, 999); // Kết thúc ngày

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
        if (status !== undefined && status !== null) {
            whereCondition.status = +status === 4 ? { [Op.in]: [4, 5, 6] } : +status;
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
                {
                    model: db.Room,
                    as: 'examinationRoomData',
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.Department,
                        as: 'roomDepartmentData',
                        attributes: ['id', 'name'],
                    },{
                        model: db.ServiceType,
                        as: 'serviceData',
                        attributes: ['id', 'name', 'price'],
                    }],
                }
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
export const getScheduleApoinment = async (filter) => {
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
        return ERROR_SERVER
    }
}
export const updateOldParaclinical = async (data) => {
    try {
        let { id, oldParaclinical } = data;
        let updateOldParaclinical = await db.Examination.update({ oldParaclinical: oldParaclinical }, { where: { id } });
        if (updateOldParaclinical[0] === 0) {
            return {
                EC: 404,
                EM: "Không tìm thấy khám bệnh",
                DT: ""
            }
        }
        return {
            EC: 0,
            EM: "Cập nhật thành công",
            DT: updateOldParaclinical
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getListToPay = async (date, statusPay, page, limit, search) => {
    try {
        // Prepare base where conditions
        const whereConditionExamination = {
            medicalTreatmentTier: 2,
        };
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
            include: [
                {
                    model: db.Examination,
                    as: 'examinationResultParaclincalData',
                    attributes: ['id', 'symptom', 'insuranceCoverage', 'insuranceCode', 'special', 'visit_status', 'isWrongTreatment', 'medicalTreatmentTier', 'createdAt'],
                    include: [
                        {
                            model: db.User,
                            as: 'userExaminationData',
                            attributes: ['id', 'firstName', 'lastName', 'email', 'cid'],
                            // include: [
                            //     {
                            //         model: db.Insurance,
                            //         as: 'userInsuranceData',
                            //         attributes: ['insuranceCode'],
                            //     },
                            // ],
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
            return dateA.getTime() - dateB.getTime();
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
export const getPatienSteps = async (examId) => {
    try {
        const examination = await db.Examination.findOne({
            where: { id: examId },
            attributes: ['id', 'status', 'roomName'],
            include: [
                {
                    model: db.Paraclinical,
                    as: 'examinationResultParaclincalData',
                    attributes: ['id', 'paraclinical', 'paracName', 'status'],
                    include: [
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
                    model: db.Prescription,
                    as: 'prescriptionExamData',
                    attributes: ['id', 'note', 'totalMoney'],
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

        // Format steps data
        const formatSteps = (data, isParaclinical = false) => {
            const stepLabels = isParaclinical ? {
                4: 'Chờ thanh toán',
                5: 'Chờ thực hiện cận lâm sàng',
                6: 'Thực hiện cận lâm sàng'
            } : {
                4: 'Chờ thanh toán',
                5: 'Chờ khám bệnh',
                6: 'Khám bệnh'
            };

            return {
                currentStatus: data.status,
                currentStep: stepLabels[data.status] || 'Chưa xác định',
                roomInfo: data.roomName || null,
                completedSteps: Object.keys(stepLabels)
                    .map(step => ({
                        status: Number(step),
                        label: stepLabels[step],
                        isCompleted: Number(step) < data.status,
                        isActive: Number(step) === data.status
                    }))
            };
        };

        // Transform response data
        const transformedData = {
            mainExamination: formatSteps(examination),
            paraclinicalTests: examination.examinationResultParaclincalData.map(test => ({
                id: test.id,
                name: test.paracName,
                room: test.roomParaclinicalData.name,
                price: test.paraclinicalData.price,
                steps: formatSteps(test, true)
            }))
        };

        return {
            EC: 0,
            EM: 'Lấy thông tin bệnh nhân thành công',
            DT: transformedData
        };

    } catch (error) {
        console.error('Error fetching patient steps:', error);
        return {
            EC: 500,
            EM: 'Lỗi server!',
            DT: '',
        };
    }
};
export const getExamToNotice = async () => {
    try {
        // Get tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Start of tomorrow

        const endOfTomorrow = new Date(tomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999); // End of tomorrow
        
        // Find examinations with reExaminationDate set to tomorrow
        const examinations = await db.Examination.findAll({
            where: {
                reExaminationDate: {
                    [Op.between]: [tomorrow, endOfTomorrow]
                }
            },
            attributes: ['id', 'userId', 'reExaminationDate', 'diseaseName'],
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
                }
            ],
            raw: true,
            nest: true
        });

        return {
            EC: 0,
            EM: "Lấy danh sách tái khám thành công",
            DT: examinations
        };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}
export const getAllExaminationsAdmin = async () => {
    try {
        let examinations = await db.Examination.findAll({
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'position'],
                    include: [
                        {
                            model: db.User,
                            as: 'staffUserData',
                            attributes: ['id', 'firstName', 'lastName'],
                        },
                    ]
                },
                {
                    model: db.Payment,
                    as: 'paymentData',
                    attributes: ['id', 'status', 'amount', 'paymentMethod'],
                },
            ],
            nest: true,
        })
        return {
            EC: 0,
            EM: 'Lấy danh sách khám bệnh thành công',
            DT: examinations
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getExaminationByIdAdmin = async (id) => {
    try {
        let examination = await db.Examination.findOne({
            where: { id: id },
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'cid', 'phoneNumber'],
                },
                {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'position', 'price', 'departmentId'],
                    include: [
                        {
                            model: db.User,
                            as: 'staffUserData',
                            attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email'],
                        },
                        {
                            model: db.Department,
                            as: 'staffDepartmentData',
                            attributes: ['id', 'name'],
                        }
                    ]
                },
                {
                    model: db.Paraclinical,
                    as: 'examinationResultParaclincalData',
                    include: [
                        {
                            model: db.Room,
                            as: 'roomParaclinicalData',
                        },
                        {
                            model: db.ServiceType,
                            as: 'paraclinicalData',
                            attributes: ['id', 'name', 'price'],
                        },
                        {
                            model: db.Staff,
                            as: 'doctorParaclinicalData',
                            attributes: ['id', 'position', 'price'],
                            include: [
                                {
                                    model: db.User,
                                    as: 'staffUserData',
                                    attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email'],
                                },
                                {
                                    model: db.Department,
                                    as: 'staffDepartmentData',
                                    attributes: ['id', 'name'],
                                }
                            ]
                        },
                        {
                            model: db.Payment,
                            as: 'paymentData',
                            attributes: ['id', 'status', 'amount', 'paymentMethod'],
                        }
                    ],
                    separate: true,
                },
                {
                    model: db.Prescription,
                    as: 'prescriptionExamData',
                    attributes: ['id', 'note', 'totalMoney'],
                    include: [{
                        model: db.Medicine,
                        as: 'prescriptionDetails',
                        attributes: ['id', 'name', 'price'],
                        through: ['quantity', 'unit', 'dosage', 'price']
                    }],
                },
                {
                    model: db.Payment,
                    as: 'paymentData',
                    attributes: ['id', 'status', 'amount', 'paymentMethod'],
                },
                {
                    model: db.VitalSign,
                    as: 'examinationVitalSignData',
                }
            ],
            nest: true,
        })
        return {
            EC: 0,
            EM: 'Lấy danh sách khám bệnh thành công',
            DT: examination
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER

    }
}
export const getListAdvanceMoney = async (page, limit, search, statusPay) => {
    try {
        const whereConditionExamination = {
            medicalTreatmentTier: 1,
        };
        if (statusPay <= 4) {
            whereConditionExamination.status = statusPay;
        } else if (statusPay > 4) {
            whereConditionExamination.status = { [Op.gte]: statusPay };
        }   

        const examinations = await db.Examination.findAll({
            where: whereConditionExamination,
            include: [{
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
            },{
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
            },{
                model: db.AdvanceMoney,
                as: 'advanceMoneyExaminationData',
                attributes: ['id', 'amount', 'date', 'status'],
                where: {
                    status: paymentStatus.PENDING,
                },
                required: true,
            },{
                model: db.Room,
                as: 'examinationRoomData',
                attributes: ['id', 'name'],
                include: [{
                    model: db.Department,
                    as: 'roomDepartmentData',
                    attributes: ['id', 'name'],
                },{
                    model: db.ServiceType,
                    as: 'serviceData',
                    attributes: ['id', 'name', 'price'],
                }],
            }],
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: (page - 1) * limit,
            distinct: true // Ensures correct count with joins
        });

        const totalItems = await db.Examination.count({
            where: {
                medicalTreatmentTier: 1,
                status: status.WAITING,
            },
            include: [
                {
                    model: db.AdvanceMoney,
                    as: 'advanceMoneyExaminationData',
                    where: {
                        status: paymentStatus.PENDING,
                    },
                    required: true,
                },
            ],
        });

        return {
            EC: 0,
            EM: 'Lấy danh sách khám bệnh thành công!',
            DT: {
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
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
}
export const getListInpations = async (date, toDate, statusExam, staffId, page, limit, search) => {
    try {
        let staff = await db.Staff.findAll({
            where: { id: staffId },
            include: [{
                model: db.Department,
                as: 'staffDepartmentData'
            }],
            raw: true,
            nest: true,
        })

        if (!staff) {
            return {
                EC: 404,
                EM: "Không tìm thấy nhân viên",
                DT: "",
            }
        }

        const whereCondition = {
            medicalTreatmentTier: 1,
            status: +statusExam
        };

        // Date filter
        if (date && toDate) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Bắt đầu ngày
            const endOfDay = new Date(toDate).setHours(23, 59, 59, 999); // Kết thúc ngày

            if(statusExam === status.DONE) {
                whereCondition.dischargeDate = {
                    [Op.between]: [startOfDay, endOfDay],
                };
            }
        }

        const searchCondition = search ? {
            [Op.or]: [
                { '$userExaminationData.firstName$': { [Op.like]: `%${search}%` } },
                { '$userExaminationData.lastName$': { [Op.like]: `%${search}%` } }
            ]
        } : {};

        let departmentId = staff[0].staffDepartmentData.id;

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
                {
                    model: db.Room,
                    as: 'examinationRoomData',
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.Department,
                        as: 'roomDepartmentData',
                        attributes: ['id', 'name'],
                        where: {
                            id: departmentId
                        },
                        required: true,
                    },{
                        model: db.ServiceType,
                        as: 'serviceData',
                        attributes: ['id', 'name', 'price'],
                    }],
                }
            ],
            limit: limit,
            offset: (page - 1) * limit,
            order: [
                ['admissionDate', 'DESC'],
            ],
        });

        return {
            EC: 0,
            EM: 'Lấy danh sách khám bệnh thành công!',
            DT: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
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
}