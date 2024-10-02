import db from "../models/index";
import { status, pamentStatus } from "../utils/index";

const getParaclinicalByExamId = async (examinationId) => {
    try{
        let paraclinical = await db.Paraclinical.findAll({
            where: {
                examinationId: examinationId
            }
        });
        if(paraclinical.length === 0){
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
            EM: "Error from server",
            DT: ""
        }
    }
}

const createParaclinical = async (data) => {
    try{
        let examination = await db.Examination.findOne({
            where: {
                id: data.examinationId
            }
        });

        if(!examination){
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

        if(existParaclinical){
            return {
                EC: 404,
                EM: "Xét nghiệm đã tồn tại",
                DT: ""
            }
        } 

        let paraclinical = await db.Paraclinical.create({
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
            DT: paraclinical
        }
        
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}

const updateParaclinical = async (data) => {
    try{
        let paraclinical = await db.Paraclinical.update({
            paraclinical: data.paraclinical,
            description: data.description,
            result: data.result,
            image: data.image,
            price: data.price
        }, {
            where: {
                id: data.id
            }
        });
        return {
            EC: 0,
            EM: "Cập nhật xét nghiệm thành công",
            DT: paraclinical
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}

const deleteParaclinical = async (data) => {
    try{
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
            EM: "Error from server",
            DT: ""
        }
    }
}

const createOrUpdateParaclinical = async (data) => {
    try{
        let examination = await db.Examination.findOne({
            where: {
                id: data.examinationId
            }
        });

        if(!examination){
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

        if(existParaclinical){
            return {
                EC: 404,
                EM: "Xét nghiệm đã tồn tại",
                DT: false
            }
        } 

        let paraclinical = await db.Paraclinical.findOne({
            where: {
                id: +data.id,
                examinationId: +data.examinationId
            }
        });

        if(paraclinical){
            let paraclinical = await db.Paraclinical.update({
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
            let paraclinical = await db.Paraclinical.create({
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
            EM: "Error from server",
            DT: ""
        }
    }
}

module.exports = {
    getParaclinicalByExamId,
    createParaclinical,
    updateParaclinical,
    deleteParaclinical,
    createOrUpdateParaclinical
}