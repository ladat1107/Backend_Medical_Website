import express from 'express';
import { sendNotification } from '../services/socketService';
import { checkTokenWithCookie } from '../Middleware/JWTAction'; // Import middleware xác thực
import { io } from '../server';
const router = express.Router();

const initNotificationRoute = (app) => {
  router.post("/send-notification",
    checkTokenWithCookie,
    async (req, res) => {
      const { title, htmlDescription, firstName, lastName, date, attachedFiles, notiCode, receiverIds } = req.body;

      if (!title || !htmlDescription) {
        return res.status(400).json({
          EC: 400,
          EM: "Thông báo không được để trống",
          DT: ""
        });
      }

      try {
        // Chuyển đổi recipients thành mảng nếu chỉ có một ID
        const recipientArray = Array.isArray(receiverIds) ? receiverIds : (receiverIds ? [receiverIds] : []);

        sendNotification(io, title, htmlDescription, firstName, lastName, date, attachedFiles, notiCode, recipientArray);

        return res.status(200).json({
          EC: 0,
          EM: "Gửi thông báo thành công",
          DT: ""
        });

      } catch (error) {
        console.error('Lỗi gửi thông báo:', error);
        res.status(500).json({
          EC: 500,
          EM: "Lỗi hệ thống khi gửi thông báo",
          DT: ""
        });
      }
    }
  );
  app.use("/api", router);
};

export default initNotificationRoute;