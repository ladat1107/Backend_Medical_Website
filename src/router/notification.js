import express from 'express';
import { sendNotification, NotificationType } from '../services/socketService';
import { io } from '../server';
import { checkTokenWithCookie } from '../Middleware/JWTAction'; // Import middleware xác thực

const router = express.Router();

const initNotificationRoute = (app) => {
  router.post("/send-notification", 
    checkTokenWithCookie,
    (req, res) => {
      const { message, type, recipients } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          EC: 400,
          EM: "Thông báo không được để trống",
          DT: ""
        });
      }
      
      try {
        // Chuyển đổi recipients thành mảng nếu chỉ có một ID
        const recipientArray = Array.isArray(recipients) ? recipients : (recipients ? [recipients] : []);
        
        sendNotification(
          io, 
          message, 
          type || NotificationType.DEFAULT,
          recipientArray
        );
        
        res.status(200).json({ 
          EC: 0,
          EM: "Gửi thông báo thành công",
          DT: null
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