import axios from 'axios';
import crypto from 'crypto';
import db from '../models/index';
import { status } from '../utils';
import { stringify } from 'querystring';

export const paymentMomo = async (data) => {
    try {
        let accessKey = 'F8BBA842ECF85';
        let secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        let orderInfo = 'pay with MoMo';
        let partnerCode = "MOMO";
        let redirectUrl = data.redirectUrl;
        let ipnUrl = 'https://cf94-118-68-51-185.ngrok-free.app/api/callback';
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
            signature: signature
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
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        }
    }
}

export const paymentMomoCallback = async (req, res) => {
    try {
        const { resultCode, extraData } = req.body;
        if (resultCode === 0) {
            let examination = JSON.parse(extraData); // Tách ID từ orderId
            await db.Examination.update(
                { paymentDoctorStatus: status.ACTIVE },
                { where: { id: examination.id } });
            return res.status(200).json({
                EC: 0,
                EM: "Thanh toán thành công, trạng thái đã được cập nhật",
                DT: req.body
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Thanh toán thất bại",
                DT: req.body
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        })

    }
}

// EXPLANATION PAYMENT MOMO
export const examinationPayment = async (req, res) => {
    try {
        let id = req.query.id;
        let examination = await db.Examination.findOne({
            where: {
                id: id
            }
        });
        if (!examination) {
            return res.status(200).json({
                EC: 404,
                EM: "Không tìm thấy cuộc hẹn",
                DT: ""
            })
        }
        let data = {
            id: examination.id,
            price: examination.price,
            redirectUrl: 'http://localhost:3000/appointmentList',
        }
        let response = await paymentMomo(data);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        })
    }
}