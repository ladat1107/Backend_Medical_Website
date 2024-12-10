import { Op } from "sequelize";
import db from "../models/index";
import room from "../models/room";
import { status, pamentStatus } from "../utils/index";
import specialtyService from "./specialtyService";

const getParaclinicalByExamId = async (examinationId) => {
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        }
    }
}

const createRequestParaclinical = async (data) => {
    try {

        if(data.listParaclinicals.length === 0){
            return {
                EC: 400,
                EM: "Danh sách xét nghiệm không được trống",
                DT: ""
            }
        }

        let examination = await db.Examination.findOne({
            where: {
                id: data.examinationId
            }
        });

        if (!examination) {
            return {
                EC: 404,
                EM: "Không tìm thấy phiên khám",
                DT: ""
            }
        }

        // Mảng lưu trạng thái các lần tạo
        let createResults = [];
        for (const item of data.listParaclinicals) {
        
            const roomDataResponse = await specialtyService.getSpecialtiesByLaboratory(+item.id);
      
            if(roomDataResponse.EC === 0 && roomDataResponse.DT){
                const roomData = roomDataResponse.DT;

                let dataParaclinical = {
                    examinationId: data.examinationId,
                    paraclinical: item.id,
                    paracName: item.label,
                    price: item.price,
                    status: status.WAITING,
                    paymentStatus: pamentStatus.UNPAID,
                    doctorId: roomData.staffId,
                    roomId: roomData.id
                };
    
                const result = await createParaclinical(dataParaclinical);
                createResults.push(result);
            } else {
                createResults.push({
                    EC: 404,
                    EM: "Không tìm thấy phòng xét nghiệm",
                    DT: ""
                });
            }
        }

        // Kiểm tra xem tất cả đều thành công
        if (createResults.every(result => result.EC === 0)) {
            return {
                EC: 0,
                EM: "Tạo tất cả xét nghiệm thành công",
                DT: createResults
            };
        } else {
            return {
                EC: 206,
                EM: "Một số xét nghiệm không tạo được",
                DT: createResults
            };
        }
        
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        }
    }
}

const createParaclinical = async (data) => {
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
                DT: ""
            }
        }

        //tim xem co ton tai xet nghiem chua
        let existParaclinical = await db.Paraclinical.findOne({
            where: {
                examinationId: data.examinationId,
                paraclinical: data.paraclinical
            }
        });

        if (existParaclinical) {
            return {
                EC: 404,
                EM: "Xét nghiệm đã tồn tại",
                DT: ""
            }
        }

        let paraclinical = await db.Paraclinical.create(data);

        return {
            EC: 0,
            EM: "Tạo xét nghiệm thành công",
            DT: paraclinical
        }

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        }
    }
}

const updateParaclinical = async (data) => {
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        }
    }
}

const deleteParaclinical = async (data) => {
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        }
    }
}

const createOrUpdateParaclinical = async (data) => {
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
                paymentStatus: pamentStatus.UNPAID,
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: ""  
        }
    }
}


const getParaclinicals = async (date, status, staffId, page, limit, search) => {
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

        // // Staff ID filter
        // if (staffId) {
        //     whereCondition.staffId = staffId;
        // }

        // Status filter
        if (status) {
            whereCondition.status = status;
        }
        // Search filter (across user's first and last name)
        // const searchCondition = search ? {
        //     [Op.or]: [
        //         { '$userExaminationData.firstName$': { [Op.like]: `%${search}%` } },
        //         { '$userExaminationData.lastName$': { [Op.like]: `%${search}%` } }
        //     ]
        // } : {};

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
                // ...searchCondition
            },
            include: [
                {
                    model: db.Examination,
                    as: 'examinationResultParaclincalData',
                    attributes: ['special'],
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
                examinations: paraclinicals,

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

module.exports = {
    getParaclinicalByExamId,
    createParaclinical,
    updateParaclinical,
    deleteParaclinical,
    createOrUpdateParaclinical,
    createRequestParaclinical,
    getParaclinicals
}