import db, { Sequelize, sequelize } from "../models/index";
import bcrypt from "bcrypt";
import { literal, Op, where } from 'sequelize';
import { sendEmailConform } from "../services/emailService";
import { createToken, verifyToken } from "../Middleware/JWTAction"
import { status } from "../utils/index";
import staffService from "./staffService";
import { sendEmailNotification } from "./emailService";
import { ROLE, TIME } from "../utils/constraints";
import { getThirdDigitFromLeft } from "../utils/getbenefitLevel";
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
            }, {
                model: db.Staff,
                as: "staffUserData",
                attributes: ["id"],
            }],
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            raw: true,
            nest: true,
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
                        user: { id: user.id, staff: user?.staffUserData?.id, lastName: user.lastName, firstName: user.firstName, role: user.roleId, email: user.email, avatar: user.avatar },
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

const checkDuplicateFields = async (email, phoneNumber, cid) => {
    try {
        const result = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { phoneNumber },
                    { cid }
                ]
            },
            attributes: ['email', 'phoneNumber', 'cid'] // Chỉ lấy các trường cần thiết
        });

        if (!result) {
            return { isDuplicate: false, duplicateField: null };
        }

        // Kiểm tra trường nào bị trùng
        let duplicateField = null;
        if (result.email === email) {
            duplicateField = 'Email đã tồn tại';
        } else if (result.phoneNumber === phoneNumber) {
            duplicateField = 'Số điện thoại đã tồn tại';
        } else if (result.cid === cid) {
            duplicateField = 'CMND/CCCD đã tồn tại';
        }

        return { isDuplicate: true, duplicateField };
    } catch (error) {
        console.error("Error checking duplicates:", error);
        throw error;
    }
};
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
                            Sequelize.literal(`CONCAT(lastName, ' ', firstName) LIKE '%${search}%'`),
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
            EM: "Lỗi server!",
            DT: "",
        };
    }
};
const getUserById = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId },
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
            EM: "Lỗi server!",
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
            include: [{
                model: db.Insurance,
                as: "userInsuranceData",
                attributes: ["insuranceCode"]
            }],
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
            EM: "Lỗi server!",
            DT: "",
        }
    }
}
const createUser = async (data) => {
    try {
        data.password = "123456";

        if (data.email && !await checkEmail(data.email)) {
            return {
                EC: 200,
                EM: "Email đã tồn tại",
                DT: "",
            }
        }
        if (!await checkCid(data.cid)) {
            return {
                EC: 200,
                EM: "CMND/CCCD đã tồn tại",
                DT: "",
            }
        }
        let hashPassword = await hashPasswordUser(data.password);
        let user = await db.User.create({
            email: data.email ? data.email : null,
            password: hashPassword,
            phoneNumber: data.phoneNumber ? data.phoneNumber : null,
            lastName: data.lastName,
            firstName: data.firstName,
            cid: data.cid,
            status: status.ACTIVE,
            roleId: data.roleId,
            dob: data.dob || null,
            address: data.address || null,
        });
        console.log(user);
        let insurance = null;
        if (data.insuranceCode && user) {
            insurance = await db.Insurance.create({
                insuranceCode: data.insuranceCode,
                benefitLevel: getThirdDigitFromLeft(data.insuranceCode),
                userId: user.id
            });
            if (!insurance) {
                await db.User.destroy({
                    where: { id: user.id }
                });
                return {
                    EC: 200,
                    EM: "Tạo tài khoản thất bại",
                    DT: "",
                }
            }
        }
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
                        EM: "Gửi email thất bại",
                        DT: "",
                    }
                }
            }
        } else {
            if (user && data.email) {
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
            } else {
                return {
                    EC: 0,
                    EM: "Thêm người dùng thành công",
                    DT: {
                        user,
                        insurance
                    },
                }
            }
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
const updateUser = async (data) => {
    let transaction = await sequelize.transaction();
    try {
        let user = await db.User.findOne({
            where: { id: data.id },
        }, { transaction });
        if (user) {
            await db.User.update({
                email: data?.email,
                phoneNumber: data?.phoneNumber,
                lastName: data?.lastName,
                firstName: data?.firstName,
                cid: data?.cid,
                dob: data?.dob || null,
                gender: data?.gender,
                address: data?.address,
                currentRescident: data?.currentRescident,
                roleId: data?.roleId,
                status: data?.status,
            }, {
                where: { id: data.id },
            }, { transaction });
            if (data.descriptionId) { // Nếu có descriptionId thì cập nhật thông tin Staff
                await db.Description.update({
                    markDownContent: data?.markDownContent,
                    htmlContent: data?.htmlContent,
                }, {
                    where: { id: data.descriptionId },
                }, { transaction });
                await db.Staff.update({
                    price: data?.price || null,
                    shortDescription: data?.shortDescription || null,
                    position: data?.position?.toString(),
                    departmentId: data?.departmentId,
                    specialtyId: data?.specialtyId || null,
                }, {
                    where: { userId: data.id },
                }, { transaction });
                await transaction.commit();
                return {
                    EC: 0,
                    EM: "Cập nhật tài khoản thành công",
                    DT: "",
                }
            } else {
                await transaction.commit();
                return {
                    EC: 0,
                    EM: "Cập nhật tài khoản thành công",
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
        await transaction.rollback();
        return {
            EC: 500,
            EM: "Lỗi server!",
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
            EM: "Lỗi server!",
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
            EM: "Lỗi server!",
            DT: ""
        }
    }
}
const registerUser = async (data) => {
    try {
        let checkExist = await checkDuplicateFields(data.email, data.phoneNumber, data.cid)
        if (checkExist?.isDuplicate) {
            return {
                EC: 200,
                EM: checkExist.duplicateField,
                DT: "",
            }
        }
        let passwordHash = await hashPasswordUser(data.password)
        sendEmailConform({ ...data, password: passwordHash });
        return {
            EC: 0,
            EM: "Vui lòng nhấn xác nhận trong email để hoàn tất đăng ký!",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Đã xảy ra lỗi",
            DT: "",
        }
    }
}
const confirmUser = async (token) => {
    try {
        let data = await verifyToken(token);
        if (data) {
            let checkExist = await checkDuplicateFields(data.email, data.phoneNumber, data.cid)
            if (checkExist?.isDuplicate) {
                return {
                    EC: 1,
                    EM: "Tài khoản đã tồn tại. Bạn có thể đăng nhập",
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
                roleId: ROLE.PATIENT,
                status: status.ACTIVE,
            })
            if (user) {
                return {
                    EC: 0,
                    EM: "Chúc mừng bạn đã trở thành thành viên của chúng tôi",
                    DT: "",
                }
            } else {
                return {
                    EC: 200,
                    EM: "Vui lòng đăng ký lại",
                    DT: "",
                }
            }
        }
        return {
            EC: 200,
            EM: "Quá hạn xác nhận",
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
const forgotPassword = async (email) => {
    try {
        let password = "123456";
        let user = await db.User.findOne({ where: { email: email } });
        if (!user) {
            return {
                EC: 200,
                EM: "Email không tồn tại",
                DT: "",
            }
        }
        let hashPassword = await hashPasswordUser(password);
        let [updatedRows] = await db.User.update(
            { password: hashPassword },
            { where: { email: email } }
        );
        if (updatedRows) {
            let content = `<p>Thông tin cập nhật của bạn:  </p>
            <p>Email: ${email}</p>
            <p>Mật khẩu mới: <strong>${password}</strong></p>
            `
            let mail = await sendEmailNotification({
                email: user.email,
                lastName: user.lastName,
                firstName: user.firstName,
                subject: "THÔNG BÁO CẬP NHẬT TÀI KHOẢN",
                content: content
            })
            if (mail.EC === 0) {
                return {
                    EC: 0,
                    EM: "Mật khẩu mới đã được gửi vào email của bạn",
                    DT: "",
                }
            } else {
                return {
                    EC: 200,
                    EM: "Có lỗi xảy ra",
                    DT: "",
                }
            }
        } else {
            return {
                EC: 200,
                EM: "Có lỗi xảy ra",
                DT: "",
            }
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
                            attributes: ['id', 'lastName', 'firstName', "avatar"], // Cho phép tìm kiếm ngay cả khi không có Department nào khớp
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
            EM: "Lỗi server!",
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
            EM: "Lỗi server!",
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
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const getUserInsuarance = async (userId) => {
    try {
        let insurance = await db.User.findOne({
            where: { id: userId },
            attributes: ["id", "firstName", "lastName", "email"],
            include: [
                {
                    model: db.Insurance,
                    as: "userInsuranceData",
                    attributes: ["id", "insuranceCode", "dateOfIssue", "exp", "benefitLevel", "residentialCode", "initialHealthcareRegistrationCode", "continuousFiveYearPeriod"],
                },
            ],
        });

        if (insurance) {
            return {
                EC: 0,
                EM: "Lấy thông tin bảo hiểm thành công",
                DT: insurance,
            };
        }

        return {
            EC: 404,
            EM: "Không tìm thấy bảo hiểm cho người dùng này",
            DT: null,
        };
    } catch (error) {
        console.error(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: null,
        };
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
    getUserInsuarance,
    confirmUser,
    forgotPassword,
}