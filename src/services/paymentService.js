import axios from 'axios';
import crypto from 'crypto';
import db from '../models/index';
import { ERROR_SERVER, PAYMENT_METHOD, paymentStatus, TYPE_PAYMENT } from '../utils';
import { updatePrescriptionMomo } from './prescriptionService';
import { Op } from 'sequelize';
import { dischargedPaymentMomo, updateExaminationMomo } from './examinationService';
import { updateAdvanceMomo } from './advanceMoneyService';
import { getThirdDigitFromLeft } from '../utils/getbenefitLevel';
import { coveredPrice } from '../utils/formatValue';
import { updateParaclinicalMomo } from './paraclinicalService';
require('dotenv').config();

let accessKey = process.env.ACCESSKEY_MOMO;
let secretKey = process.env.SECRETKEY_MOMO;

// ngrok http 8843 
// TK: 9704 0000 0000 0018  
// 03/07
// NGUYEN VAN A

let ngrokUrl = "https://backend-medical-website.onrender.com";

export const paymentMomo = async (data) => {
    try {
        let orderInfo = 'pay with MoMo';
        let partnerCode = "MOMO";
        let redirectUrl = data.redirectUrl;
        let ipnUrl = `${ngrokUrl}/api/callbackMomo`;
        let requestType = "payWithMethod";
        let amount = data.price;
        let orderId = partnerCode + new Date().getTime();
        let requestId = orderId;
        let extraData = JSON.stringify(data);
        let paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
        let orderGroupId = '';
        let autoCapture = true;
        let lang = 'vi';

        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        let rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

        let signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
            orderExpireTime: 5,
        });
        //Create the HTTPS objects
        let response = await axios.post(
            'https://test-payment.momo.vn/v2/gateway/api/create',
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            }
        );
        if (response.data.resultCode === 0) {
            return {
                EC: 0,
                EM: "Success",
                DT: response.data
            }
        } else {
            return {
                EC: response.data.errorCode,
                EM: response.data.message,
                DT: ""
            }
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const paymentMomoCallback = async (req, res) => {
    try {
        let data = req.body;
        if (data.resultCode === 0) {
            let detail = JSON.stringify(data);

            let payment = await db.Payment.create({
                orderId: data.orderId,
                amount: data.amount,
                paymentMethod: PAYMENT_METHOD.MOMO,
                status: paymentStatus.PAID,
                detail: detail,
                transId: data.transId,
            });
            if (payment) {
                let dataExtra = JSON.parse(data.extraData);
                let result = true;
                if (dataExtra.type === TYPE_PAYMENT.PARA_CLINICAL) {
                    result = await updateParaclinicalMomo(dataExtra, payment);
                } else if (dataExtra.type === TYPE_PAYMENT.EXAMINATION) {
                    result = await updateExaminationMomo(dataExtra, payment);
                } else if (dataExtra.type === TYPE_PAYMENT.PRESCRIPTION) {
                    result = await updatePrescriptionMomo(dataExtra, payment);
                } else if (dataExtra.type === TYPE_PAYMENT.ADVANCE) {
                    result = await updateAdvanceMomo(dataExtra, payment);
                } else if (dataExtra.type === TYPE_PAYMENT.DISCHARGE) {
                    result = await dischargedPaymentMomo(dataExtra, payment);
                }
                if (result === false) {
                    await db.Payment.destroy({
                        where: {
                            id: payment.id
                        }
                    });
                    console.log("Lỗi khi cập nhật trạng thái");
                }
            } else {
                console.log("Tạo thanh toán thất bại");
            }
        } else {
            console.log("Thanh toán thất bại");
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)

    }
}

export const refundMomo = async (data) => {
    try {
        let partnerCode = "MOMO";
        let orderId = partnerCode + new Date().getTime();
        let requestId = orderId; // Mã yêu cầu hoàn tiền duy nhất
        let amount = data.amount; // Số tiền cần hoàn
        let transId = data.transId; // Mã giao dịch trên hệ thống MoMo
        let description = 'Refund due to appointment cancellation';
        let lang = 'vi';

        // Tạo chữ ký
        let rawSignature = `accessKey=${accessKey}&amount=${amount}&description=${description}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}&transId=${transId}`;
        let signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

        // Tạo request body
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            orderId: orderId,
            amount: amount,
            transId: +transId,
            description: description,
            signature: signature,
            lang: lang,
        });

        // Gửi yêu cầu hoàn tiền
        let response = await axios.post(
            'https://test-payment.momo.vn/v2/gateway/api/refund',
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody),
                },
            }
        );

        // Kiểm tra kết quả trả về
        if (response.data.resultCode === 0) {
            return { EC: 0, EM: "Hoàn tiền thành công", DT: response.data, };
        } else {
            return {
                EC: response.data.resultCode,
                EM: response.data.message,
                DT: "",
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "System error",
            DT: "",
        };
    }
};
// Thanh toán đơn khám
export const examinationPayment = async (req, res) => {
    try {
        let dataReq = req.body;
        let examination = await db.Examination.findOne({
            where: {
                id: dataReq.id
            }
        });
        if (!examination) {
            return res.status(200).json({
                EC: 404,
                EM: "Không tìm thấy đơn khám",
                DT: ""
            })
        }

        let body = {
            id: examination.id,
            type: TYPE_PAYMENT.EXAMINATION,
            price: Math.round(dataReq?.coveredPrice || examination?.price),
            redirectUrl: `${process.env.REACT_APP_BACKEND_URL}/cashier`,
            update: dataReq
        }
        let response = await paymentMomo(body);
        return res.status(200).json(response)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
// Thanh toán đơn cận lâm sàng
export const paraclinicalPayment = async (req, res) => {
    try {
        let { ids, insurance } = req.body;
        const insuranceCoverage = insurance ? getThirdDigitFromLeft(insurance) : 0
        if (!ids || ids.length === 0) {
            return res.status(200).json({ EC: 404, EM: "Không tìm thấy dịch vụ cận lâm sàng", DT: "" })
        }
        let paraclinicals = await db.Paraclinical.findAll({
            where: { id: { [Op.in]: ids } },
        });

        let price = 0;
        for (let paraclinical of paraclinicals) {
            price += +paraclinical.price - coveredPrice(+paraclinical.price, insuranceCoverage);
        }

        let data = {
            id: ids,
            type: TYPE_PAYMENT.PARA_CLINICAL,
            price: price,
            insuranceCoverage: insuranceCoverage,
            redirectUrl: `${process.env.REACT_APP_BACKEND_URL}/cashier`,
        }
        let response = await paymentMomo(data);
        return res.status(200).json(response)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
// Thanh toán đơn thuốc
export const prescriptionPayment = async (req, res) => {
    try {
        let dataReq = req.body;
        let prescription = await db.Prescription.findOne({ where: { id: dataReq.id }, });
        if (!prescription) {
            return res.status(200).json({ EC: 404, EM: "Không tìm thấy đơn thuốc", DT: "" })
        }
        let body = {
            id: prescription.id,
            type: TYPE_PAYMENT.PRESCRIPTION,
            price: Math.round(dataReq.coveredPrice),
            redirectUrl: `${process.env.REACT_APP_BACKEND_URL}/prescribe`,
            update: dataReq
        }
        let response = await paymentMomo(body);
        return res.status(200).json(response)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
// Thanh toán tiền tạm ứng
export const examinationAdvancePayment = async (req, res) => {
    try {
        let dataReq = req.body;
        let advance = await db.AdvanceMoney.findOne({ where: { id: dataReq.advanceId } });
        if (!advance) {
            return res.status(200).json({ EC: 404, EM: "Không tìm thấy tiền tạm ứng", DT: "" })
        }
        let body = {
            id: advance.id,
            type: TYPE_PAYMENT.ADVANCE,
            price: Math.round(dataReq?.advanceMoney),
            redirectUrl: `${process.env.REACT_APP_BACKEND_URL}/cashier`,
            update: dataReq
        }
        let response = await paymentMomo(body);
        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
// Thanh toán xuất viện
export const dischargedPayment = async (req, res) => {
    try {
        let dataReq = req.body;
        let examination = await db.Examination.findOne({ where: { id: dataReq.id } });
        if (!examination) {
            return res.status(200).json({ EC: 404, EM: "Không tìm thấy đơn khám", DT: "" })
        }
        let body = {
            id: examination.id,
            type: TYPE_PAYMENT.DISCHARGE,
            price: Math.round(dataReq.amount),
            redirectUrl: `${process.env.REACT_APP_BACKEND_URL}/cashier`,
            update: dataReq
        }
        let response = await paymentMomo(body);
        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}


export const getPaymentAdmin = async (fillter) => {
    try {
        let { startDate, endDate } = fillter;
        let payments = await db.Payment.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
            },
            include: [
                {
                    model: db.Examination,
                    as: 'examinationData',
                    attributes: ['id', 'price', 'insuranceCovered', 'coveredPrice', 'status', 'medicalTreatmentTier'],
                    include: [{
                        model: db.Paraclinical,
                        as: 'examinationResultParaclincalData',
                        attributes: ['id', 'price', 'insuranceCovered', 'coveredPrice', 'status'],
                        required: false,
                    }, {
                        model: db.Prescription,
                        as: 'prescriptionExamData',
                        attributes: ['id', 'totalMoney', 'insuranceCovered', 'coveredPrice', 'status'],
                        required: false,
                    }],
                    required: false,
                },
                {
                    model: db.Paraclinical,
                    as: 'paraclinicalData',
                    attributes: ['id', 'price', 'insuranceCovered', 'coveredPrice', 'status'],
                    required: false,
                },
                {
                    model: db.Prescription,
                    as: 'prescriptionData',
                    attributes: ['id', 'totalMoney', 'insuranceCovered', 'coveredPrice', 'status'],
                    required: false,
                },
                {
                    model: db.AdvanceMoney,
                    as: 'advanceMoneyData',
                    required: false,
                }
            ],
            nest: true,
            order: [['createdAt', 'DESC']]
        });
        return {
            EC: 0,
            EM: "Lấy danh sách thanh toán thành công",
            DT: payments
        };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}