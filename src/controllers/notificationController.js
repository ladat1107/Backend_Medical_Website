import { createNotification, getAllNotifications, getAllUserToNotify, updateNotification } from "../services/notificationService";
import { ERROR_SERVER, status } from "../utils/index";

export const getAllNotificationsController = async (req, res) => {
    try {
        let { page, limit, search } = req.query;
        let userId = req.user.id;
        let notifications = await getAllNotifications(page, limit, search, userId);
        if (notifications.EC === 0) {
            return res.status(200).json(notifications)
        }
        return res.status(500).json(ERROR_SERVER);
    } catch (error) {
        console.log(error);
        return res.status(200).json(ERROR_SERVER)
    }
}

export const getAllUserToNotifyController = async (req, res) => {
    try {
        let userId = req.user.id;
        let roleId = req.user.roleId;
        let response = await getAllUserToNotify(userId, roleId);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
} 

export const  createNotificationController = async (req, res) => {
    try {
        let data = req.body;
        if(!data.dataNoti || !data.dataNoti.title || !data.dataNoti.htmlDescription || !data.dataNoti.receiverId || !data.dataNoti.status) {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không hợp lệ",
                DT: ""
            }) 
        }
        data.dataNoti.senderId = req.user.id;
        let notification = await createNotification(data);
        if (notification.EC === 0) {
            return res.status(200).json(notification)
        }
        return res.status(500).json(ERROR_SERVER);
    } catch (error) {
        console.log(error);
        return res.status(200).json(ERROR_SERVER)
    }
}

export const updateNotificationController = async (req, res) => {
    try {
        let data = req.body;
        if(!data.id || !data.title || !data.htmlDescription || !data.receiverId || !data.status) {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không hợp lệ",
                DT: ""
            }) 
        }
        
        let response = await updateNotification(data);

        if (response.EC === 0) {
            return res.status(200).json(response)
        }
        return res.status(500).json(ERROR_SERVER);
    } catch (error) {
        console.log(error);
        return res.status(200).json(ERROR_SERVER)
    }
}