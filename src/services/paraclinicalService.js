import { Op } from "sequelize";
import db from "../models/index";
import { status, paymentStatus, PAYMENT_METHOD, ERROR_SERVER, ROLE } from "../utils/index";
import specialtyService, { getSpecialtiesByLaboratory } from "./specialtyService";
import { getThirdDigitFromLeft } from "../utils/getbenefitLevel";
import { coveredPrice } from "../utils/formatValue";
import { staffLoad } from "./socketService";
import { io } from "../server";

export const getParaclinicalByExamId = async (examinationId) => {
    try {
        let paraclinical = await db.Paraclinical.findAll({
            where: {
                examinationId: examinationId
            }
        });
        if (paraclinical.length === 0) {
            return {
                EC: 404,
                EM: "Không tìm thấy xét nghiệm",
                DT: ""
            }
        }
        return {
            EC: 0,
            EM: "Lấy thông tin xét nghiệm thành công",
            DT: paraclinical
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createRequestParaclinical = async (data) => {
    // Initialize transaction
    const transaction = await db.sequelize.transaction();

    try {
        if (data.listParaclinicals.length === 0) {
            return {
                EC: 400,
                EM: "Danh sách xét nghiệm không được trống",
                DT: ""
            }
        }

        let examination = await db.Examination.findOne({
            where: {
                id: data.examinationId
            },
            transaction
        });

        if (!examination) {
            await transaction.rollback();
            return {
                EC: 404,
                EM: "Không tìm thấy phiên khám",
                DT: ""
            }
        }

        let createResults = [];
        for (const item of data.listParaclinicals) {

            const roomDataResponse = await getSpecialtiesByLaboratory(+item.id);

            if (roomDataResponse.EC === 0 && roomDataResponse.DT) {
                const roomData = roomDataResponse.DT;

                let dataParaclinical = {
                    examinationId: data.examinationId,
                    paraclinical: item.id,
                    paracName: item.label,
                    price: item.price,
                    status: data?.isInpatient ? status.PAID : status.WAITING,
                    paymentStatus: data?.isInpatient ? paymentStatus.PAID : paymentStatus.UNPAID,
                    doctorId: roomData.staffId,
                    roomId: roomData.id,
                    insuranceCovered: coveredPrice(item.price, examination.insuranceCoverage),
                    coveredPrice: +item.price - coveredPrice(item.price, examination.insuranceCoverage),
                };

                const result = await createParaclinical(dataParaclinical, transaction);
                result.DT.dataValues.staffName = roomData.staffName;
                result.DT.dataValues.roomName = roomData.name;

                createResults.push(result);
            } else {
                createResults.push({
                    EC: 404,
                    EM: "Không tìm thấy phòng xét nghiệm",
                    DT: ""
                });
            }
        }

        await examination.update({
            status: status.EXAMINING,
        }, { transaction });

        // Kiểm tra xem tất cả đều thành công
        if (createResults.every(result => result.EC === 0)) {

            const listAccountants = await db.User.findAll({
                where: { roleId: ROLE.ACCOUNTANT },
                attributes: ['id'],
                raw: true,
                transaction
            });

            staffLoad(io, listAccountants.map(item => item.id));

            await transaction.commit(); // Commit transaction if everything succeeded
            return {
                EC: 0,
                EM: "Tạo tất cả xét nghiệm thành công",
                DT: createResults
            };
        } else {
            await transaction.rollback(); // Rollback if any creation failed
            return {
                EC: 206,
                EM: "Một số xét nghiệm không tạo được",
                DT: createResults
            };
        }

    } catch (error) {
        await transaction.rollback(); // Rollback on any error
        console.log(error);
        return ERROR_SERVER
    }
}

export const createParaclinical = async (data, transaction = null) => {
    try {
        let examination = await db.Examination.findOne({
            where: {
                id: data.examinationId
            },
            transaction // Pass transaction to this query as well
        });

        if (!examination) {
            return {
                EC: 404,
                EM: "Không tìm thấy phiên khám",
                DT: ""
            }
        }

        let paraclinical = await db.Paraclinical.create(data, { transaction });
        return {
            EC: 0,
            EM: "Tạo xét nghiệm thành công",
            DT: paraclinical
        }

    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateParaclinical = async (data) => {
    try {
        const { id, ...updateData } = data; // Tách id ra khỏi data

        let paraclinical = await db.Paraclinical.update(
            updateData, // Chỉ truyền các dữ liệu cần update
            {
                where: {
                    id: id // Sử dụng id đã tách để làm điều kiện
                }
            }
        );
        return {
            EC: 0,
            EM: "Cập nhật xét nghiệm thành công",
            DT: paraclinical
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const deleteParaclinical = async (data) => {
    try {
        let paraclinical = await db.Paraclinical.destroy({
            where: {
                id: +data.id,
                examinationId: +data.examinationId
            }
        });
        return {
            EC: 0,
            EM: "Xóa xét nghiệm thành công",
            DT: paraclinical
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createOrUpdateParaclinical = async (data) => {
    try {
        let examination = await db.Examination.findOne({
            where: {
                id: data.examinationId
            }
        });

        if (!examination) {
            return {
                EC: 404,
                EM: "Không tìm thấy phiên khám",
                DT: false
            }
        }

        let existParaclinical = await db.Paraclinical.findOne({
            where: {
                examinationId: data.examinationId,
                paraclinical: data.paraclinical
            }
        });

        if (existParaclinical) {

            if (existParaclinical.id === data.id) {
                await existParaclinical.update({
                    paraclinical: data.paraclinical,
                    description: data.description,
                    result: data.result,
                    image: data.image,
                    price: data.price
                }, {
                    where: {
                        id: +data.id,
                        examinationId: +data.examinationId
                    }
                });

                return {
                    EC: 0,
                    EM: "Cập nhật xét nghiệm thành công",
                    DT: true
                }
            } else {
                return {
                    EC: 404,
                    EM: "Xét nghiệm đã tồn tại",
                    DT: false
                }
            }
        } else {
            await db.Paraclinical.create({
                id: data.id,
                examinationId: data.examinationId,
                paraclinical: data.paraclinical,
                description: data.description,
                result: data.result,
                image: data.image,
                status: status.ACTIVE,
                paymentStatus: paymentStatus.UNPAID,
                price: data.price,
                doctorId: data.doctorId
            });
            return {
                EC: 0,
                EM: "Tạo xét nghiệm thành công",
                DT: true
            }
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getParaclinicals = async (date, status, staffId, page, limit, search) => {
    try {
        const whereCondition = {};

        // Date filter
        if (date) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Bắt đầu ngày
            const endOfDay = new Date(date).setHours(23, 59, 59, 999); // Kết thúc ngày

            whereCondition.createdAt = {
                [Op.between]: [startOfDay, endOfDay],
            };
        }

        // Status filter
        if (status) {
            whereCondition.status = status;
        }

        let offset, limit_query;
        if (status === 2) {
            // Nếu status là 2, không phân trang
            offset = 0;
            limit_query = null;
        } else {
            offset = (page - 1) * limit;
            limit_query = limit;
        }

        const { count, rows: paraclinicals } = await db.Paraclinical.findAndCountAll({
            where: {
                ...whereCondition,
            },
            include: [
                {
                    model: db.Examination,
                    as: 'examinationResultParaclincalData',
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
                                    { lastName: { [Op.like]: `%${search}%` } },
                                    { cid: { [Op.like]: `%${search}%` } },
                                    { phoneNumber: { [Op.like]: `%${search}%` } },
                                ]
                            } : {},
                            required: true
                        },
                    ],
                    required: true
                },
                {
                    model: db.Staff,
                    as: 'doctorParaclinicalData',
                    attributes: ['id', 'position', 'price'],
                    include: [
                        {
                            model: db.User,
                            as: 'staffUserData',
                            attributes: ['firstName', 'lastName']
                        },
                    ],
                    ...(staffId ? { where: { id: staffId }, required: true } : {}),
                },
                {
                    model: db.Room,
                    as: 'roomParaclinicalData',
                    attributes: ['id', 'name'],
                },
                {
                    model: db.ServiceType,
                    as: 'paraclinicalData',
                    attributes: ['name', 'price']
                }
            ],
            limit: limit_query,
            offset,
            order: [
                // Sắp xếp theo thời gian từ cũ đến mới
                ['createdAt', 'ASC']
            ],
            distinct: true // Ensures correct count with joins
        });

        // Sắp xếp kết quả sau khi truy vấn dựa trên medicalTreatmentTier
        const sortedParaclinicals = [...paraclinicals].sort((a, b) => {
            const tierA = a.examinationResultParaclincalData?.medicalTreatmentTier || 0;
            const tierB = b.examinationResultParaclincalData?.medicalTreatmentTier || 0;

            // Đưa các bản ghi có medicalTreatmentTier = 3 lên đầu
            if (tierA === 3 && tierB !== 3) return -1;
            if (tierA !== 3 && tierB === 3) return 1;

            // Nếu cùng mức độ ưu tiên, sắp xếp theo thời gian
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        return {
            EC: 0,
            EM: 'Lấy danh sách khám bệnh thành công!',
            DT: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                examinations: sortedParaclinicals,
            },
        };
    } catch (error) {
        console.error('Error fetching paraclinicals:', error);
        return {
            EC: 500,
            EM: 'Lỗi server!',
            DT: '',
        };
    }
};

export const updateListPayParaclinicals = async (ids, insurance, userId) => {
    // Initialize transaction
    const transaction = await db.sequelize.transaction();

    try {
        const insuranceCoverage = insurance ? getThirdDigitFromLeft(insurance) : 0

        let paraclinicals = await db.Paraclinical.findAll({
            where: { id: { [Op.in]: ids } },
            transaction // Pass transaction to this query
        });

        let price = 0;
        for (let paraclinical of paraclinicals) {
            price += +paraclinical.price - coveredPrice(+paraclinical.price, insuranceCoverage);
        }

        let receiver = await db.User.findOne({
            where: { id: userId },
            attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'cid'],
            raw: true,
            transaction
        });

        let details = {};
        if (receiver) {
            details = { ...details, receiver, responseTime: new Date().toISOString() }
        }
        
        // Create payment within the transaction
        let payment = await db.Payment.create({
            orderId: new Date().toISOString() + "_UserId__" + userId,
            transId: Math.floor(100000 + Math.random() * 900000),
            amount: price,
            paymentMethod: PAYMENT_METHOD.CASH,
            status: paymentStatus.PAID,
            detail: JSON.stringify(details)
        }, { transaction }); // Pass transaction to payment creation

        // Update all paraclinicals within the transaction
        for (let paraclinical of paraclinicals) {
            const updateResult = await db.Paraclinical.update(
                {
                    insuranceCovered: coveredPrice(+paraclinical.price, insuranceCoverage),
                    coveredPrice: +paraclinical.price - coveredPrice(+paraclinical.price, insuranceCoverage),
                    status: status.PAID,
                    paymentId: payment.id
                }, {
                where: {
                    id: paraclinical.id
                },
                transaction // Pass transaction here as well
            });

            // Check if update was successful (returns [affectedCount])
            if (!updateResult || updateResult[0] === 0) {
                // If update failed, throw an error to trigger rollback
                throw new Error(`Failed to update paraclinical with ID: ${paraclinical.id}`);
            }
        }

        const listDoctors = await db.User.findAll({
            where: { 
                [Op.or]: [
                    { roleId: ROLE.DOCTOR },
                    { roleId: ROLE.NURSE }
                ]
            },
            attributes: ['id'],
            raw: true,
            transaction
        });

        staffLoad(io, listDoctors.map(item => item.id))

        // If we've reached here, all operations were successful, commit the transaction
        await transaction.commit();

        return {
            EC: 0,
            EM: 'Cập nhật danh sách xét nghiệm thành công!',
            DT: { success: true, paraclinicalCount: paraclinicals.length },
        };

    } catch (error) {
        // If any error occurred, rollback the transaction
        await transaction.rollback();

        console.error('Error updating list paraclinicals:', error);
        return {
            EC: 500,
            EM: 'Lỗi server: ' + error.message,
            DT: '',
        };
    }
};

export const updateParaclinicalMomo = async (data, payment) => {
    let transaction = await db.sequelize.transaction();
    try {
        let ids = data?.id;

        let paraclinicals = await db.Paraclinical.findAll({
            where: { id: { [Op.in]: ids } },
            transaction // Pass transaction to this query
        });

        for (let paraclinical of paraclinicals) {
            const updateResult = await db.Paraclinical.update(
                {
                    insuranceCovered: coveredPrice(+paraclinical.price, data.insuranceCoverage),
                    coveredPrice: +paraclinical.price - coveredPrice(+paraclinical.price, data.insuranceCoverage),
                    status: status.PAID,
                    paymentId: payment.id
                }, {
                where: {
                    id: paraclinical.id
                },
                transaction // Pass transaction here as well
            });

            // Check if update was successful (returns [affectedCount])
            if (!updateResult || updateResult[0] === 0) {
                // If update failed, throw an error to trigger rollback
                throw new Error(`Failed to update paraclinical with ID: ${paraclinical.id}`);
            }
        }
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return false;
    }
}