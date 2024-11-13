import db, { Sequelize, sequelize } from "../models/index";
import bcrypt from "bcrypt";
import { literal, Op } from 'sequelize';
import { sendEmailConform } from "../services/emailService";
import { createToken, verifyToken } from "../Middleware/JWTAction"
import { status } from "../utils/index";
import staffService from "./staffService";
import { sendEmailNotification } from "./emailService";
import { ROLE, TIME } from "../utils/constraints";
require('dotenv').config();
const salt = bcrypt.genSaltSync(10);

let hashPasswordUser = async (password) => {
    try {
        let hashPassword = await bcrypt.hashSync(password, salt);
        return hashPassword;
    } catch (e) {
        console.log(e);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
        }
    }
}
let loginUser = async (data) => {
    try {
        let user = await db.User.findOne({
            where: {
                email: data.email,
            },
            include: [{
                model: db.Role,
                as: "userRoleData",
                attributes: ["name"],
            }],
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        })
        if (user) {
            let comparePassword = await bcrypt.compareSync(data.password, user.password);
            if (comparePassword) {
                let data = {
                    id: user.id,
                    email: user.email,
                    roleId: user.roleId,
                }
                let token = createToken(data, TIME.tokenLife);
                let refreshToken = createToken(data, TIME.refreshToken);
                return {
                    EC: 0,
                    EM: "Đăng nhập thành công",
                    DT: {
                        user: { id: user.id, lastName: user.lastName, firstName: user.firstName, role: user.roleId, email: user.email, avatar: user.avatar },
                        accessToken: token,
                        refreshToken: refreshToken
                    }
                }
            }
        }
        return {
            EC: 200,
            EM: "Tên đăng nhập hoặc mật khẩu không đúng",
            DT: ''
        }
    }
    catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}
const checkEmail = async (email) => {
    try {
        let user = await db.User.findOne({
            where: { email: email }
        });

        if (user) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
const checkPhoneNumber = async (phoneNumber) => {
    try {
        let user = await db.User.findOne({ where: { phoneNumber: phoneNumber } });
        if (user) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
const checkCid = async (cid) => {
    try {
        let user = await db.User.findOne({ where: { cid: cid } });
        if (user) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getAllUser = async (page, limit, search, position) => {
    try {
        let defaultPositions = [1, 3, 4, 5, 6, 7];

        // Nếu không có giá trị `position`, gán giá trị mặc định
        if (!position || position.length === 0) {
            position = defaultPositions;
        }
        let userDepartment = await db.Department.findAll({
            where: {
                name: { [Op.like]: `%${search}%` }
            },
            attributes: ["id"],
            raw: true,
        });
        let staff = await db.Staff.findAll({
            where: {
                [Op.or]: [
                    { position: { [Op.like]: `%${search}%` } },
                    { departmentId: { [Op.in]: userDepartment.map(item => item.id) } }
                ],
            },
            attributes: ["userId"],
            raw: true,
        });

        let users = await db.User.findAndCountAll({
            where: {
                [Op.and]: [
                    { roleId: { [Op.in]: position } },
                    {
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${search}%` } },
                            { lastName: { [Op.like]: `%${search}%` } },
                            { email: { [Op.like]: `%${search}%` } },
                            { phoneNumber: { [Op.like]: `%${search}%` } },
                            { cid: { [Op.like]: `%${search}%` } },
                            { id: { [Op.in]: staff.map(item => item.userId) } }
                        ]
                    }
                ]
            },
            include: [
                {
                    model: db.Staff,
                    as: "staffUserData",
                    attributes: ["id", "price", "position", "departmentId", "shortDescription"],
                    include: [
                        {
                            model: db.Department,
                            as: 'staffDepartmentData',
                            attributes: ['id', 'name'],
                            required: false, // Cho phép tìm kiếm ngay cả khi không có Department nào khớp
                        }
                    ],
                    required: false, // Cho phép tìm kiếm ngay cả khi không có Staff nào khớp
                },
                {
                    model: db.Role,
                    as: "userRoleData",
                    attributes: ["id", "name"],
                    require: false
                },
            ],
            order: [
                ["status", "DESC"],
                ['createdAt', 'DESC']], // Sắp xếp theo ngày tạo mới nhất

            // Phân trang
            offset: (+page - 1) * +limit,
            limit: +limit,
            attributes: {
                exclude: ["password"]
            },
            raw: true,
            nest: true,
        })
        return {
            EC: 0,
            EM: "Lấy thông tin người dùng thành công",
            DT: users
        };

    } catch (error) {
        console.error(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        };
    }
};


const getUserById = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId, status: status.ACTIVE },
            attributes: ["id", "email", "phoneNumber", "lastName", "firstName",
                "cid", "dob", "address", "currentResident", "gender", "avatar", "folk", "ABOBloodGroup",
                "RHBloodGroup", "maritalStatus", "roleId", "point", "status"],
            include: [
                {
                    model: db.Staff,
                    as: "staffUserData",
                    attributes: ["id", "price", "position", "departmentId", "specialtyId", "shortDescription"],
                    include: [
                        {
                            model: db.Description,
                            as: "staffDescriptionData",
                            attributes: ["id", "markDownContent", "htmlContent"],
                        },
                        {
                            model: db.Department,
                            as: 'staffDepartmentData',
                            attributes: ['id', 'name'],
                        },
                        {
                            model: db.Specialty,
                            as: 'staffSpecialtyData',
                            attributes: ['id', 'name'],
                        },
                    ]
                },

            ],
            raw: true,
            nest: true,
        });
        if (user) {
            return {
                EC: 0,
                EM: "Lấy thông tin người dùng thành công",
                DT: user
            }
        }
        return {
            EC: 200,
            EM: "Không tìm thấy người dùng",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

const getUserByCid = async (cid) => {
    try {
        let user = await db.User.findOne({
            where: { cid: cid },
            attributes: ["id", "phoneNumber", "lastName", "firstName",
                "cid", "dob", "gender",],
            raw: true,
            nest: true,
        });
        if (user) {
            return {
                EC: 0,
                EM: "Lấy thông tin người dùng thành công",
                DT: user
            }
        }
        return {
            EC: 200,
            EM: "Không tìm thấy người dùng",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

const createUser = async (data) => {
    try {
        if (!await checkEmail(data.email)) {
            return {
                EC: 200,
                EM: "Email đã tồn tại",
                DT: "",
            }
        }

        let hashPassword = await hashPasswordUser(data.password);
        let user = await db.User.create({
            email: data.email,
            password: hashPassword,
            phoneNumber: data.phoneNumber,
            lastName: data.lastName,
            firstName: data.firstName,
            cid: data.cid,
            status: status.ACTIVE,
            roleId: data.roleId
        });
        if (data.staff) {
            const staff = await staffService.createStaff(data, user.id);
            if (!staff) {
                await db.User.destroy({
                    where: { id: user.id }
                });
                return {
                    EC: 200,
                    EM: "Tạo tài khoản thất bại",
                    DT: "",
                }
            } else {
                let mail = await sendEmailNotification(
                    {
                        email: user.email,
                        lastName: user.lastName,
                        firstName: user.firstName,
                        subject: "TÀI KHOẢN NHÂN VIÊN",
                        content: ` <p>Chúc mừng bạn đã trở thành nhân viên của chúng tôi. Bạn có thể đăng nhập vào hệ thống bằng email: <strong>${user.email}</strong> và mật khẩu <strong>${data.password}</strong>. </p>`
                    }
                );
                if (mail.EC === 0) {
                    return {
                        EC: 0,
                        EM: "Thêm người dùng thành công",
                        DT: "",
                    }
                } else {
                    return {
                        EC: 200,
                        EM: "Gửi mail thông báo thất bại",
                        DT: "",
                    }
                }

            }
        } else {
            if (user) {
                let mail = await sendEmailNotification({
                    email: user.email,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    subject: "TÀI KHOẢN MỚI",
                    content: `Chúc mừng bạn đã trở thành người dùng của chúng tôi. Bạn có thể đăng nhập vào hệ thống bằng email: <strong>${user.email}</strong> và mật khẩu <strong>${data.password}</strong>.`
                })
                if (mail.EC === 0) {
                    return {
                        EC: 0,
                        EM: "Thêm người dùng thành công",
                        DT: "",
                    }
                } else {
                    return {
                        EC: 200,
                        EM: "Gửi mail thông báo thất bại",
                        DT: "",
                    }
                }
            }
        }

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}
const updateUser = async (data) => {
    let transaction = await sequelize.transaction();
    try {
        let updateFeild = {};
        let content = null;
        if (data.password) {
            updateFeild.password = await hashPasswordUser(data.password);
            console.log(updateFeild);
            content = `<p>Thông tin cập nhật của bạn:  </p>
            <p>Email: ${data.email}</p>
            <p>Mật khẩu mới: <strong>${data.password}</strong></p>
            `
        }
        let user = await db.User.findOne({
            where: { id: data.id },
        });
        if (user) {
            await db.User.update({
                ...updateFeild,
                email: data?.email,
                phoneNumber: data?.phoneNumber,
                lastName: data?.lastName,
                firstName: data?.firstName,
                cid: data?.cid,
                dob: data?.dob,
                gender: data?.gender,
                address: data?.address,
                currentRescident: data?.currentRescident,
                roleId: data?.roleId,
                status: data?.status,
            }, {
                where: { id: data.id },
            }, { transaction });
            if (user.roleId === ROLE.ACCOUNTANT || user.roleId === ROLE.DOCTOR || user.roleId === ROLE.NURSE || user.roleId === ROLE.PHARMACIST || user.roleId === ROLE.RECEPTIONIST) {
                console.log(data.markDownContent);
                await db.Description.update({
                    markDownContent: data?.markDownContent,
                    htmlContent: data?.htmlContent,
                }, {
                    where: { id: data.descriptionId },
                }, { transaction });
                await db.Staff.update({
                    price: data?.price,
                    shortDescription: data?.shortDescription || null,
                    position: data?.position?.toString(),
                    departmentId: data?.departmentId,
                    specialtyId: data?.specialtyId || null,
                }, {
                    where: { userId: data.id },
                }, { transaction });
                await transaction.commit();
                if (content?.length > 0) {
                    console.log("Gửi mail");
                    let mail = await sendEmailNotification({
                        email: user.email,
                        lastName: user.lastName,
                        firstName: user.firstName,
                        subject: "THÔNG BÁO CẬP NHẬT TÀI KHOẢN",
                        content: content
                    })
                    if (mail.EC === 0) {
                        console.log("Gửi mail thành công");
                        return {
                            EC: 0,
                            EM: "Cập nhật tài khoản thành công",
                            DT: "",
                        }
                    } else {
                        return {
                            EC: 200,
                            EM: "Gửi mail thông báo thất bại",
                            DT: "",
                        }
                    }
                } else {
                    return {
                        EC: 0,
                        EM: "Cập nhật tài khoản thành công",
                        DT: "",
                    }
                }
            } else {
                await transaction.commit();
                if (content.length > 0) {
                    console.log("Gửi mail");
                    let mail = await sendEmailNotification({
                        email: user.email,
                        lastName: user.lastName,
                        firstName: user.firstName,
                        subject: "THÔNG BÁO CẬP NHẬT TÀI KHOẢN",
                        content: content
                    })
                    if (mail.EC === 0) {
                        console.log("Gửi mail thành công");
                        return {
                            EC: 0,
                            EM: "Cập nhật tài khoản thành công",
                            DT: "",
                        }
                    } else {
                        return {
                            EC: 200,
                            EM: "Gửi mail thông báo thất bại",
                            DT: "",
                        }
                    }
                } else {
                    return {
                        EC: 0,
                        EM: "Cập nhật tài khoản thành công",
                        DT: "",
                    }
                }
            }
        } else {
            return {
                EC: 200,
                EM: "Không tìm thấy người dùng",
                DT: "",
            }
        }
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

const blockUser = async (data) => {
    try {
        let user = await db.User.update({
            status: status.INACTIVE,
        }, {
            where: {
                id: data.id
            }
        });
        if (user) {
            return {
                EC: 0,
                EM: `Khóa hoạt động người dùng ${data.firstName + " " + data.lastName} thành công`,
                DT: "",
            }
        } else {
            return {
                EC: 200,
                EM: "Không tìm thấy người dùng",
                DT: "",
            }
        }

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        }
    }
}
const deleteUser = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId },
        });
        if (user) {
            let name = user.lastName + " " + user.firstName;
            await user.destroy();
            return {
                EC: 0,
                EM: `Xóa người dùng ${name} thành công`,
                DT: "",
            }
        }
        return {
            EC: 200,
            EM: "Không tìm thấy người dùng",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        }
    }
}

const registerUser = async (data) => {
    try {
        if (await checkEmail(data.email) == false) {
            return {
                EC: 200,
                EM: "Email đã tồn tại",
                DT: "",
            }
        }
        let passwordHash = await hashPasswordUser(data.password)
        sendEmailConform({ ...data, password: passwordHash });
        return {
            EC: 0,
            EM: "Đăng ký thành công",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}
const confirmUser = async (token) => {
    try {
        let data = await verifyToken(token);

        if (data) {
            console.log("gửi mail thành công");
            if (await checkEmail(data.email) == false) {
                return {
                    EC: 200,
                    EM: "Bạn đã đăng ký tài khoản này",
                    DT: "",
                }
            }
            let user = await db.User.create({
                email: data.email,
                password: data.password,
                lastName: data.lastName,
                firstName: data.firstName,
                phoneNumber: data.phoneNumber,
                cid: data.cid,
                currentResident: data.currentResident,
                dob: data.dob,
                folk: data.folk,
                point: 0,
                roleId: 1,
                status: 1,
            })
            if (user) {
                return {
                    EC: 0,
                    EM: "Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ",
                    DT: "",
                }
            } else {
                return {
                    EC: 200,
                    EM: "Đăng ký thất bại",
                    DT: "",
                }
            }
        }
        return {
            EC: 200,
            EM: "Token không hợp lệ",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}
const getDoctorHome = async () => {
    try {
        let examCount = await db.Examination.findAll({
            attributes: [
                'staffId',
                [Sequelize.fn('COUNT', Sequelize.col('staffId')), 'examinationsCount']
            ],
            include: [
                {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'position', "userId"],
                    include: [
                        {
                            model: db.User,
                            as: 'staffUserData',
                            attributes: ['id', 'lastName', 'firstName'], // Cho phép tìm kiếm ngay cả khi không có Department nào khớp
                        }
                    ],
                }
            ],
            group: ['staffId'],
            limit: 20,
            order: [[literal('examinationsCount'), 'DESC']],
        })
        return {
            EC: 0,
            EM: "Lấy thông tin bác sĩ thành công",
            DT: examCount
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }

    }
}
const updateProfileInfor = async (data) => {
    try {
        let [numberOfAffectedRows] = await db.User.update({
            phoneNumber: data?.phoneNumber,
            lastName: data?.lastName,
            firstName: data?.firstName,
            gender: data?.gender || null,
            avatar: data?.avatar || null,
            cid: data?.cid,
            dob: data?.dob || null,
            address: data?.address || null,
            currentResident: data?.currentResident || null,
            folk: data?.folk || null,
            ABOBloodGroup: data?.ABOBloodGroup || null,
            RHBloodGroup: data?.RHBloodGroup || null,
            maritalStatus: data?.maritalStatus || null,
        }, {
            where: { id: data.id },
        });
        if (numberOfAffectedRows === 0) {
            return {
                EC: 200,
                EM: "Không tìm thấy người dùng",
                DT: "",
            }
        } else {
            return {
                EC: 0,
                EM: "Cập nhật thông tin thành công",
                DT: "",
            }
        }
    }
    catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}
const updateProfilePassword = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { id: data.id },
            attributes: ["password"],
        });
        if (user) {
            let comparePassword = await bcrypt.compareSync(data.oldPassword, user.password);
            if (comparePassword) {
                let hashPassword = await hashPasswordUser(data.newPassword);
                let [numberOfAffectedRows] = await db.User.update({
                    password: hashPassword,
                }, {
                    where: { id: data.id },
                });
                if (numberOfAffectedRows === 0) {
                    return {
                        EC: 200,
                        EM: "Cập nhật mật khẩu thất bại",
                        DT: "",
                    }
                } else {
                    return {
                        EC: 0,
                        EM: "Cập nhật mật khẩu thành công",
                        DT: "",
                    }
                }
            } else {
                return {
                    EC: 200,
                    EM: "Mật khẩu cũ không đúng",
                    DT: "",
                }
            }
        } else {
            return {
                EC: 200,
                EM: "Không tìm thấy người dùng",
                DT: "",
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}
module.exports = {
    getAllUser,
    getUserById,
    getUserByCid,
    createUser,
    updateUser,
    blockUser,
    deleteUser,
    registerUser,
    loginUser,
    getDoctorHome,
    updateProfileInfor,
    updateProfilePassword,
}