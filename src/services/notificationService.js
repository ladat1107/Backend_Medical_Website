import db from "../models/index";
import { generateUniqueKey } from "../utils/generateUniqueKey";
import { ERROR_SERVER, status } from "../utils/index";
import { Op, Sequelize } from 'sequelize';

export const getAllNotifications = async (page, limit, search, userId) => {
    try {
        let whereConditions = {
            receiverId: userId
        };

        if (search) {
            whereConditions = {
                receiverId: userId,
                [Op.or]: [
                    { title: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const unreadCount = await db.Notification.count({
            where: {
                receiverId: userId,
                status: 1
            }
        });

        let notifications = await db.Notification.findAndCountAll({
            where: whereConditions,
            include: [{
                model: db.User,
                as: 'NotificationSenderData',
                attributes: ['id', 'email', 'phoneNumber', 'lastName', 'firstName', 'avatar'],
                // include: [{
                //     model: db.User,
                //     as: 'staffUserData',
                //     attributes: ['id', 'email', 'phoneNumber', 'lastName', 'firstName', 'avatar'],
                //     include: [{
                //         model: db.Role,
                //         as: 'userRoleData',
                //         attributes: ['name']
                //     }],
                // }]
            },{
                model: db.AttachFile,
                as: 'NotificationAttachFileData',
                attributes: ['link', 'type'],
            }],
            offset: (+page - 1) * +limit,
            limit: +limit,
            order: [['date', 'DESC']],
            distinct: true,
        });
        
        if (!notifications || notifications.count === 0) {
            return {
                EC: 404,
                EM: "Không tìm thấy thông báo",
                DT: "",
            }
        }
        
        return {
            EC: 0,
            EM: "Lấy thông báo thành công",
            DT: {notifications,unreadCount}
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getAllUserToNotify = async (userId, roleId) => {
    try {
        if (roleId === 1) {
            return await getAllUserToNotifyFull(); // Tách logic này ra hàm riêng
        }

        let users = await db.User.findAll({
            where: {
                status: status.ACTIVE
            },
            attributes: ['id', 'email', 'firstName', 'lastName'],
            include: [{
                model: db.Staff,
                as: "staffUserData",
                attributes: ["id"],
                include: [{
                    model: db.Department,
                    as: "staffDepartmentData",
                    where: {
                        status: status.ACTIVE
                    },
                }]
            }],
        });

        // Get all departments with their deans
        const departments = await db.Department.findAll({
            include: [{
                model: db.Staff,
                as: "deanDepartmentData",
                attributes: ['id'],
                include: [{
                    model: db.User,
                    as: "staffUserData",
                    attributes: ['id', 'email', 'firstName', 'lastName']
                }]
            }]
        });

        // Create a map of department to dean for quick lookup
        const departmentDeanMap = {};
        departments.forEach(department => {
            if (department.deanDepartmentData && department.deanDepartmentData.staffUserData) {
                departmentDeanMap[department.id] = {
                    staffId: department.deanDepartmentData.id,
                    userId: department.deanDepartmentData.staffUserData.id,
                    email: department.deanDepartmentData.staffUserData.email,
                    firstName: department.deanDepartmentData.staffUserData.firstName,
                    lastName: department.deanDepartmentData.staffUserData.lastName,
                    isDean: true
                };
            }
        });

        // Kiểm tra user có phải là trưởng khoa không
        let isDean = false;
        let deanDepartment = null;

        departments.forEach(department => {
            const dean = departmentDeanMap[department.id];
            if (dean && dean.userId === userId) {
                isDean = true;
                deanDepartment = department;
            }
        });

        if (isDean && deanDepartment) {
            const departmentId = deanDepartment.id;
            const departmentGroup = {
                id: departmentId,
                name: deanDepartment.name,
                description: `${deanDepartment.name} (${deanDepartment.address || 'No address'})`,
                users: users
                    .filter(user => user.staffUserData?.some(staff => staff.staffDepartmentData?.id === departmentId))
                    .map(user => ({
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        staffId: user.staffUserData[0]?.id,
                        isDean: departmentDeanMap[departmentId]?.userId === user.id
                    }))
            };

            // Sắp xếp để trưởng khoa lên đầu danh sách
            departmentGroup.users.sort((a, b) => b.isDean - a.isDean);

            return {
                EC: 0,
                EM: "Lấy thông tin người dùng thành công",
                DT: {
                    userGroups: [departmentGroup]
                }
            };
        }

        // Nếu không phải admin và không phải trưởng khoa, trả về rỗng
        return {
            EC: 0,
            EM: "Người dùng không có quyền truy cập",
            DT: {
                userGroups: []
            }
        };

    } catch (error) {
        console.error(error);
        return ERROR_SERVER;
    }
};


export const getAllUserToNotifyFull = async () => {
    try {
        let users = await db.User.findAll({
            where: {
                status: status.ACTIVE
            },
            attributes: ['id', 'email', 'firstName', 'lastName'],
            include: [{
                model: db.Staff,
                as: "staffUserData",
                attributes: ["id"],
                include: [{
                    model: db.Department,
                    as: "staffDepartmentData",
                    where: {
                        status: status.ACTIVE
                    },
                }]
            }],
        });

        // Get all departments with their deans
        const departments = await db.Department.findAll({
            include: [{
                model: db.Staff,
                as: "deanDepartmentData",
                attributes: ['id'],
                include: [{
                    model: db.User,
                    as: "staffUserData",
                    attributes: ['id', 'email', 'firstName', 'lastName']
                }]
            }]
        });

        // Create a map of department to dean for quick lookup
        const departmentDeanMap = {};
        departments.forEach(department => {
            if (department.deanDepartmentData && department.deanDepartmentData.staffUserData) {
                departmentDeanMap[department.id] = {
                    staffId: department.deanDepartmentData.id,
                    userId: department.deanDepartmentData.staffUserData.id,
                    email: department.deanDepartmentData.staffUserData.email,
                    firstName: department.deanDepartmentData.staffUserData.firstName,
                    lastName: department.deanDepartmentData.staffUserData.lastName,
                    isDean: true
                };
            }
        });

        // New structured response
        const userGroups = [];
        const departmentGroups = [];
        const regularUsers = [];

        // Process each user
        users.forEach(user => {
            const plainUser = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            };

            // Check if user is staff or regular user
            if (user.staffUserData && user.staffUserData.length > 0) {
                const department = user.staffUserData[0].staffDepartmentData;
                
                // Create staff user object without department information
                const staffUser = {
                    ...plainUser,
                    staffId: user.staffUserData[0].id,
                    isDean: false // Default is not dean
                };

                // Check if this staff is a dean
                if (department) {
                    const departmentId = department.id;
                    const dean = departmentDeanMap[departmentId];
                    if (dean && dean.userId === user.id) {
                        staffUser.isDean = true;
                    }
                    
                    // Find or create department group
                    let departmentGroup = departmentGroups.find(group => group.id === departmentId);
                    
                    if (!departmentGroup) {
                        departmentGroup = {
                            id: departmentId,
                            name: department.name,
                            description: `${department.name} (${department.address || 'No address'})`,
                            users: []
                        };
                        departmentGroups.push(departmentGroup);
                    }
                    
                    // Add user to department group
                    departmentGroup.users.push(staffUser);
                }
            } else {
                // Add to regularUsers
                regularUsers.push(plainUser);
            }
        });

        // Sort department groups' users to put deans first
        departmentGroups.forEach(group => {
            group.users.sort((a, b) => {
                if (a.isDean && !b.isDean) return -1;
                if (!a.isDean && b.isDean) return 1;
                return 0;
            });
        });

        // Create the final user groups structure
        if (regularUsers.length > 0) {
            userGroups.push({
                id: 'regular',
                name: 'Người dùng thông thường',
                description: 'Người dùng không thuộc phòng ban nào',
                users: regularUsers
            });
        }

        // Add department groups to userGroups
        userGroups.push(...departmentGroups);

        return {
            EC: 0,
            EM: "Lấy thông tin người dùng thành công",
            DT: {
                userGroups: userGroups
            },


        };
    } catch (error) {
        console.error(error);
        return ERROR_SERVER;
    }
}

export const createNotification = async (data) => {
    try {
        let receiverIds = data.dataNoti.receiverId.split(",");
        let notiCode = generateUniqueKey(16);

        let notificationsData = receiverIds.map(receiverId => ({
            title: data.dataNoti.title,
            htmlDescription: data.dataNoti.htmlDescription,
            senderId: data.dataNoti.senderId,
            status: data.dataNoti.status,
            date: new Date(),
            notiCode: notiCode,
            receiverId: +receiverId.trim() // Remove any potential whitespace
        }));

        let attachedFilesWithNotiCode = data.attachedFiles.map(file => ({
            ...file,
            notiCode: notiCode 
        }));
        let notifications = await db.Notification.bulkCreate(notificationsData);
        let attachFiles = await db.AttachFile.bulkCreate(attachedFilesWithNotiCode);

        if (!notifications || !attachFiles) {
            return {
                EC: 404,
                EM: "Tạo thông báo thất bại",
                DT: "",
            }
        }
        return {
            EC: 0,
            EM: "Tạo thông báo thành công",
            DT: notifications
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}

export const updateNotification = async (data) => {
    try {
        let notification = await db.Notification.update({
            receiverId: data.receiverId,
            title: data.title,
            htmlDescription: data.htmlDescription,
            status: data.status,
        }, {
            where: { id: data.id }
        });
        if (!notification) {
            return {
                EC: 404,
                EM: "Cập nhật thông báo thất bại",
                DT: "",
            }
        }
        return {
            EC: 0,
            EM: "Cập nhật thông báo thành công",
            DT: notification
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}