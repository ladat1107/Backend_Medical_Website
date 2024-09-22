import nodemailer from "nodemailer"
require('dotenv').config();
import { createToken } from "../Middleware/JWTAction"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_APP,
        pass: process.env.PASSWORD_APP,
    },
    tls: {
        rejectUnauthorized: false
    }
});

let sendEmailConform = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token = createToken(data);
            let urlRedirect = `${process.env.REACT_APP_BACKEND_URL}/api/confirm?confirm=${token}`;
            let info = await transporter.sendMail({
                from: "Bệnh viện Hoa sen <benhvienhoasen@gmail.com>",//process.env.GMAIL_APP, // sender address
                to: `${data.email}`, // list of receivers
                subject: "XÁC NHẬN TÀI KHOẢN", // Subject line
                html: `<div style="width: 100%; padding: 20px; background-color: #ffffff; max-width: 600px; margin: 0 auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #4CAF50; color: white; padding: 10px 0; text-align: center;">
            <h2>Appointment Confirmation</h2>
        </div>
        <div style="padding: 20px;">
            <h1>Hi ${data.lastName + " " + data.firstName},</h1>
            <p>Cảm ơn bạn đã tin tưởng:</p>
            <p><strong>Bệnh viện Hoa Sen:</strong></p>
            <p><strong>Location:</strong> 203, Nguyễn Trãi, Linh Trung, Thủ Đức, TPHCM</p>
            <p>Việc đặt lịch khám bệnh sẽ trở nên dễ dàng hơn bao giờ hết! </p>
            <p>Bạn vui lòng bấm nút xác nhận để tạo tài khoản:</p>
            <a href="${urlRedirect}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: white; background-color: #4CAF50; text-align: center; text-decoration: none; border-radius: 5px;">Reschedule</a>
            <p>Mong sớm gặp bạn!</p>
            <p>Chúc bạn vui vẻ,</p>
            <p>Bệnh viên Hoa Sen</p>
        </div>
        <div style="text-align: center; padding: 10px; background-color: #f4f4f4; color: #666666; font-size: 12px;">
            <p>&copy; 2024 . All rights reserved.</p>
            <p>[Bệnh viện Hoa Sen] | [0362322010]</p>
        </div>
    </div>`});
            console.log("Message sent: %s", info.messageId);
            resolve({
                errCode: 200,
                message: "OK"
            })

        } catch (error) {
            console.log("Gửi mail lỗi");
            reject(error);
        }
    })
}

module.exports = {
    sendEmailConform: sendEmailConform
}