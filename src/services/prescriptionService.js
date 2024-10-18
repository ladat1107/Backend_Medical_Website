import db from '../models/index';
import prescriptionDetailService from './prescriptionDetailService';
import { status, pamentStatus } from "../utils/index";
import { Sequelize, where } from 'sequelize';

const calculateTotalMoney = (details) => {
    return details.reduce((sum, detail) => sum + (detail.quantity * detail.price), 0);
};

const getPrescriptionByExaminationId = async (examinationId) => {
    try{
        let prescription = await db.Prescription.findOne({
            where: { examinationId: examinationId },
            attributes: ['id', 'examinationId', 'note', 'totalMoney', 'paymentStatus'],
            include:[{
                model: db.PrescriptionDetail,
                as: 'prescriptionDetails',
                attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt']  // Loại bỏ cột id nếu nó không tồn tại
                },
                include: [
                    {
                        model: db.Medicine,
                        as: 'prescriptionDetailMedicineData',
                        attributes: ['id', 'name', 'price'],
                    }
                ]
            }],
            nest: true,
        });
        if(!prescription){
            return {
                EC: 1,
                EM: "Không tìm thấy đơn thuốc",
                DT: "",
            }
        }
        return {
            EC: 0,
            EM: "Lấy thông tin đơn thuốc thành công",
            DT: prescription
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

const upsertPrescription = async (data) => {
    try {
        let [prescription, created] = await db.Prescription.findOrCreate({
            where: { examinationId: data.examinationId, status: status.ACTIVE },
            defaults: {
                note: data.note,
                totalMoney: data.totalMoney,
                paymentStatus: pamentStatus.UNPAID,
                status: status.ACTIVE,
            }
        });

        if (!created) {
            await prescription.update({
                note: data.note,
                totalMoney: data.totalMoney,
                paymentStatus: pamentStatus.UNPAID,
            });
        }

        let prescriptionDetail = await prescriptionDetailService.upsertPrescriptionDetail(prescription.id, data.prescriptionDetails);

        if (!prescriptionDetail) {
            return {
                EC: 1,
                EM: "Cập nhật chi tiết đơn thuốc không thành công",
                DT: "",
            };
        }

        return {
            EC: 0,
            EM: created ? "Tạo đơn thuốc thành công" : "Cập nhật đơn thuốc thành công",
            DT: true
        };

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi từ server",
            DT: "",
        };
    }
};

module.exports = {
    getPrescriptionByExaminationId,
    upsertPrescription
}
