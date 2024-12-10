import db from '../models/index';
import medicineService from './medicineService';

const getAllPrescriptionDetailsByPrescriptionId = async (prescriptionId) => {
    try {
        let prescriptionDetail = await db.PrescriptionDetail.findAll({
            where: { prescriptionId: prescriptionId },
            include: [
                {
                    model: db.Medicine,
                    as: 'prescriptionDetailMedicineData',
                    attributes: ['id', 'name', 'price'],
                }
            ],
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin PrescriptionDetail thành công",
            DT: prescriptionDetail
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

const upsertPrescriptionDetail = async (prescriptionId, newDetails) => {
    try {

        for (const newDetail of newDetails) {
            const medicine = await db.Medicine.findByPk(newDetail.medicineId);
            
            if (!medicine) {
                return {
                    EC: 404,
                    EM: `Không tìm thấy thuốc có ID: ${newDetail.medicineId}`,
                    DT: "",
                };
            }

            // Kiểm tra số lượng tồn kho
            const existingDetail = await db.PrescriptionDetail.findOne({
                where: { 
                    prescriptionId, 
                    medicineId: newDetail.medicineId 
                }
            });

            // Tính toán số lượng cần thêm/giảm
            const quantityChange = existingDetail 
                ? newDetail.quantity - existingDetail.quantity 
                : newDetail.quantity;

            // Kiểm tra nếu số lượng yêu cầu vượt quá số lượng tồn kho
            if (medicine.inventory < Math.abs(quantityChange)) {
                return {
                    EC: 400,
                    EM: `Thuốc ${medicine.name} không đủ số lượng. Tồn kho: ${medicine.inventory}, Yêu cầu: ${Math.abs(quantityChange)}`,
                    DT: "",
                };
            }
        }


        const existingDetails = await db.PrescriptionDetail.findAll({
            where: { prescriptionId },
            attributes: {
                exclude: ['id']
            },
        });

        const existingDetailsMap = new Map(existingDetails.map(detail => [detail.medicineId, detail]));   
        const updatedDetails = [];

        for (const newDetail of newDetails) {
            const existingDetail = existingDetailsMap.get(newDetail.medicineId);
            if (existingDetail) {
                const quantityChange = newDetail.quantity - existingDetail.quantity;
                await existingDetail.update({
                    quantity: newDetail.quantity,
                    unit: newDetail.unit,
                    dosage: newDetail.dosage,
                    price: newDetail.price
                });
                updatedDetails.push(existingDetail);
                existingDetailsMap.delete(newDetail.medicineId);

                if (quantityChange !== 0) {
                    await medicineService.updateInventory(newDetail.medicineId, quantityChange);
                }
            } else {
                const createdDetail = await db.PrescriptionDetail.create({
                    prescriptionId,
                    ...newDetail
                });
                updatedDetails.push(createdDetail);
                await medicineService.updateInventory(newDetail.medicineId, newDetail.quantity);
            }
        }

        for (const [medicineId, detail] of existingDetailsMap) {
            await detail.destroy();
            await medicineService.updateInventory(medicineId, -detail.quantity);
        }

        return {
            EC: 0,
            EM: "Cập nhật chi tiết đơn thuốc thành công",
            DT: updatedDetails
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

const createPrescriptionDetail = async (prescriptionId, data) => {
    try {
        let prescriptionDetail = await db.PrescriptionDetail.create({
            prescriptionId: prescriptionId,
            medicineId: data.medicineId,
            quantity: data.quantity,
            unit: data.unit,
            dosage: data.dosage,
            price: data.price
        });
        if (prescriptionDetail) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

const updatePrescriptionDetail = async (prescriptionId, data) => {
    try {
        let prescriptionDetail = await db.PrescriptionDetail.findOne({
            where: {
                prescriptionId: prescriptionId,
                medicineId: data.medicineId
            }
        });
        if (prescriptionDetail) {
            prescriptionDetail.update({
                quantity: data.quantity,
                unit: data.unit,
                dosage: data.dosage,
                price: data.price
            })
            console.log("Update PrescriptionDetail successfully");
            return true;
        } else {
            console.log("PrescriptionDetail not found");
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

const deletePrescriptionDetail = async (data) => {
    try {
        let prescriptionDetail = await db.PrescriptionDetail.findOne({
            where: {
                prescriptionId: data.prescriptionId,
                medicineId: data.medicineId
            }
        });
        if (prescriptionDetail) {
            prescriptionDetail.destroy();
            console.log("Delete PrescriptionDetail successfully");
            return true;
        } else {
            console.log("PrescriptionDetail not found");
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    getAllPrescriptionDetailsByPrescriptionId,
    createPrescriptionDetail,
    updatePrescriptionDetail,
    upsertPrescriptionDetail,
    deletePrescriptionDetail
}