import db, { Sequelize, sequelize } from "../models/index";
import bcrypt from "bcrypt";
import { Op, where } from 'sequelize';
import { createToken, verifyToken } from "../Middleware/JWTAction"
import { status } from "../utils/index";
import { createStaff } from "./staffService";
import { sendEmailNotification, sendEmailConformAppoinment, sendEmailConform } from "./emailService";
import { ERROR_SERVER, paymentStatus, ROLE, TIME, typeRoom } from "../utils/constraints";
import { getThirdDigitFromLeft } from "../utils/getbenefitLevel";
require('dotenv').config();
export const salt = bcrypt.genSaltSync(10);

export const hashPasswordUser = async (password) => {
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
export const loginUser = async (data) => {
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
                    staff: user?.staffUserData?.id,
                    version: user.tokenVersion,
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
        return ERROR_SERVER
    }
}
export const loginGoogle = async (data, googleId) => {
    try {
        let user = await db.User.findOne({
            where: { email: data.email },
            include: [{
                model: db.Role,
                as: "userRoleData",
                attributes: ["name"],
            }, {
                model: db.Staff,
                as: "staffUserData",
                attributes: ["id"],
            }],
        });
        if (!user) {
            user = await db.User.create({
                email: data.email,
                lastName: data.family_name,
                firstName: data.given_name,
                avatar: data.picture,
                googleId: googleId,
                roleId: ROLE.PATIENT,
                tokenVersion: new Date().getTime(),
                status: status.ACTIVE,
            });
        }
        let dataToken = {
            id: user.id,
            email: user.email,
            roleId: user.roleId,
            staff: user?.staffUserData?.id,
            version: user.tokenVersion,
        }
        let token = createToken(dataToken, TIME.tokenLife);
        let refreshToken = createToken(dataToken, TIME.refreshToken);
        return {
            EC: 0,
            EM: "Đăng nhập thành công",
            DT: {
                user: { id: user.id, staff: user?.staffUserData?.id, lastName: user.lastName, firstName: user.firstName, role: user.roleId, email: user.email, avatar: user.avatar },
                accessToken: token,
                refreshToken: refreshToken
            }
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const checkEmail = async (email) => {
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
export const checkPhoneNumber = async (phoneNumber) => {
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
export const checkCid = async (cid) => {
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
export const checkDuplicateFields = async (email, phoneNumber, cid) => {
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
export const getAllUser = async (page, limit, search, position) => {
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
        return ERROR_SERVER;
    }
};
export const getUserById = async (userId) => {
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
                    attributes: ["id", "price", "position", "departmentId", "specialtyId", "shortDescription", "htmlDescription"],
                    include: [
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
        return ERROR_SERVER
    }
}
export const getUserByCid = async (cid) => {
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
        return ERROR_SERVER
    }
}
export const createUser = async (data) => {
    let transaction = await db.sequelize.transaction();;
    try {
        data.password = "123456";
        if (data.email && !await checkEmail(data.email)) {
            return { EC: 200, EM: "Email đã tồn tại", DT: "", }
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
            tokenVersion: new Date().getTime(),
            dob: data.dob || null,
            address: data.address || null,
        },
            { transaction });
        if (data?.insuranceCode && user) {
            await db.Insurance.create({
                insuranceCode: data.insuranceCode,
                benefitLevel: getThirdDigitFromLeft(data.insuranceCode),
                userId: user.id
            }, { transaction });
        }
        if (data?.staff && user) {
            await db.Staff.create({
                price: data?.price || 0,
                position: data?.position ? data.position.toString() : "",
                departmentId: data.departmentId,
                shortDescription: data?.shortDescription || null,
                specialtyId: data?.specialtyId || null,
                status: status.ACTIVE,
                htmlDescription: data?.htmlDescription || null,
                userId: user.id
            }, { transaction });

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
                await transaction.commit();
                return {
                    EC: 0,
                    EM: "Thêm người dùng thành công",
                    DT: "",
                }
            } else {
                await transaction.rollback();
                return { EC: 200, EM: "Gửi email thất bại", DT: "", }
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
                    await transaction.commit();
                    return {
                        EC: 0,
                        EM: "Thêm người dùng thành công",
                        DT: "",
                    }
                } else {
                    await transaction.rollback();
                    return {
                        EC: 200,
                        EM: "Gửi mail thông báo thất bại",
                        DT: "",
                    }
                }
            } else {
                await transaction.commit();
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
        await transaction.rollback();
        return ERROR_SERVER
    }
}
export const updateUser = async (data) => {
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

            if (data.staffId) { // Nếu có departmentId thì cập nhật thông tin Staff                
                await db.Staff.update({
                    price: data?.price || null,
                    shortDescription: data?.shortDescription || null,
                    position: data?.position?.toString(),
                    departmentId: data?.departmentId,
                    specialtyId: data?.specialtyId || null,
                    htmlDescription: data?.htmlDescription || null,
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
        return ERROR_SERVER
    }
}
export const blockUser = async (data) => {
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
        return ERROR_SERVER
    }
}
export const deleteUser = async (userId) => {
    let transaction = await db.sequelize.transaction();
    try {
        let user = await db.User.findOne({
            where: { id: userId },
        });
        if (user) {
            let name = user.lastName + " " + user.firstName;
            let staff = await db.Staff.findOne({
                where: { userId: userId },
            })
            if (staff) {
                await db.Staff.destroy({
                    where: { userId: userId },
                }, { transaction });
            }
            await db.User.destroy({
                where: { id: userId },
            }, { transaction });
            await transaction.commit();
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
        await transaction.rollback();
        return ERROR_SERVER
    }
}
export const registerUser = async (data) => {
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
        let urlRedirect = `${process.env.REACT_APP_BACKEND_URL}/login?confirm=`
        sendEmailConform({ ...data, password: passwordHash }, urlRedirect);
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
export const confirmUser = async (token) => {
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
        return ERROR_SERVER
    }
}
export const forgotPassword = async (email) => {
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
            { password: hashPassword, tokenVersion: new Date().getTime() },
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
        return ERROR_SERVER
    }
}
export const getDoctorHome = async (filter) => {
    try {
        let condition = {};
        let includeOption = [];
        let search = filter?.search || "";
        let departmentId = filter?.departmentId || null;
        let specialtyId = filter?.specialtyId || null;
        let listStaff = [];
        if (filter?.page && filter?.limit) {
            let limit = +filter.limit > 36 ? 36 : +filter.limit;
            listStaff = await db.Staff.findAndCountAll({
                where: { status: status.ACTIVE },
                include: [
                    {
                        model: db.User,
                        as: 'staffUserData',
                        where: {
                            status: status.ACTIVE,
                            roleId: ROLE.DOCTOR,
                            [Op.or]: [
                                { firstName: { [Op.like]: `%${search}%` } },
                                { lastName: { [Op.like]: `%${search}%` } },
                                Sequelize.literal(`CONCAT(lastName, ' ', firstName) LIKE '%${search}%'`),
                            ],
                        },
                        attributes: ['id', 'lastName', 'firstName', 'avatar', 'gender'],
                    },
                    {
                        model: db.Department,
                        where: departmentId ? { id: departmentId } : {},
                        as: 'staffDepartmentData',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: db.Specialty,
                        where: specialtyId ? { id: specialtyId } : {},
                        as: 'staffSpecialtyData',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: db.Examination,
                        as: 'examinationStaffData',
                        attributes: ['id'],
                    },
                ],
                attributes: ['id', 'position', 'userId', 'price'],
                nest: true,
                offset: (+filter.page - 1) * limit,
                limit: limit,
                distinct: true,
            });
            // listStaff = { count: count, rows: _listStaff };
        } else {
            if (filter?.date) {
                includeOption.push({
                    model: db.Schedule,
                    as: 'staffScheduleData',
                    where: {
                        date: { [Op.gte]: new Date() },
                    },
                    include: [
                        {
                            model: db.Room,
                            as: 'scheduleRoomData',
                            where: { departmentId: typeRoom.CLINIC, },
                            attributes: ['name'],
                        },
                    ],
                    required: true,
                    attributes: ['date', "roomId", "staffId"],
                    raw: true,
                });
            }
            // Áp dụng các bộ lọc departmentId và specialtyId
            if (filter?.departmentId) {
                condition.departmentId = filter.departmentId;
            }
            if (filter?.specialtyId) {
                condition.specialtyId = +filter.specialtyId;
            }
            // Truy vấn danh sách staff
            listStaff = await db.Staff.findAll({
                where: {
                    status: status.ACTIVE,
                    ...condition,
                },
                include: [
                    {
                        model: db.User,
                        as: 'staffUserData',
                        where: {
                            status: status.ACTIVE,
                            roleId: ROLE.DOCTOR,
                            [Op.or]: [
                                { firstName: { [Op.like]: `%${search}%` } },
                                { lastName: { [Op.like]: `%${search}%` } },
                                Sequelize.literal(`CONCAT(lastName, ' ', firstName) LIKE '%${search}%'`),
                            ],
                        },
                        attributes: ['id', 'lastName', 'firstName', 'avatar', 'gender'],
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
                    {
                        model: db.Examination,
                        as: 'examinationStaffData',
                        attributes: ['id'],
                    },
                    ...includeOption, // Thêm lịch theo điều kiện date
                ],
                attributes: ['id', 'position', 'userId', 'price'],
                nest: true,
            });
        }
        return {
            EC: 0,
            EM: "Lấy thông tin bác sĩ thành công",
            DT: listStaff,
        };
    } catch (error) {
        console.error("Lỗi server:", error);
        return ERROR_SERVER;
    }
};
export const updateProfileInfor = async (data) => {
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
        return ERROR_SERVER
    }
}
export const updateProfilePassword = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { id: data.id },
            include: [{
                model: db.Role,
                as: "userRoleData",
                attributes: ["name"],
            }, {
                model: db.Staff,
                as: "staffUserData",
                attributes: ["id"],
            }],
            raw: true,
            nest: true,
        });
        if (user) {
            let comparePassword = await bcrypt.compareSync(data.oldPassword, user.password);
            if (comparePassword) {
                let timestamp = new Date().getTime();
                let hashPassword = await hashPasswordUser(data.newPassword);
                let [numberOfAffectedRows] = await db.User.update({
                    password: hashPassword,
                    tokenVersion: timestamp,
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
                    let data = {
                        id: user.id,
                        email: user.email,
                        roleId: user.roleId,
                        staff: user?.staffUserData?.id,
                        version: user.tokenVersion,
                    }
                    let refreshToken = createToken(data, TIME.refreshToken);
                    return {
                        EC: 0,
                        EM: "Cập nhật mật khẩu thành công",
                        DT: refreshToken,
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
        return ERROR_SERVER
    }
}
export const getUserInsuarance = async (userId) => {
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
export const confirmBooking = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { cid: data.profile.cid },
        });
        if (!user) {
            data.profile.bookFor = true;
        } else {
            let examination = await db.Examination.findAll({
                where: {
                    userId: user.id,
                    admissionDate: new Date(data.schedule.date),
                    status: status.PENDING,
                    is_appointment: 1,
                }
            });
            if (examination.length > 0) {
                return {
                    EC: 200,
                    EM: "Mỗi người dùng chỉ được đặt lịch khám một lần trong ngày",
                    DT: "",
                }
            }
        }
        let urlRedirect = `${process.env.REACT_APP_BACKEND_URL}/appointmentList?confirm=`
        let mail = await sendEmailConformAppoinment(data, urlRedirect);
        if (mail.errCode === 200) {
            return {
                EC: 0,
                EM: "Vui lòng kiểm tra email để xác nhận lich khám",
                DT: "",
            }
        } else {
            return {
                EC: 200,
                EM: "Có lỗi xảy ra. Vui lòng thử lại sau",
                DT: "",
            }
        }

    } catch (error) {
        console.error(error);
        return ERROR_SERVER;
    }
}
export const confirmTokenBooking = async (token) => {
    let transaction = await sequelize.transaction();
    try {
        let data = await verifyToken(token);

        if (data) {
            let user;
            let examinationCount = await db.Examination.findAll({
                where: {
                    admissionDate: new Date(data.schedule.date),
                    time: data.schedule.time.value,
                    status: status.PENDING,
                    is_appointment: 1,
                },
            });
            if (examinationCount.length >= 6) {
                return {
                    EC: 200,
                    EM: "Lịch khám đã được đặt hết",
                    DT: "",
                }
            }
            let staff = await db.Staff.findOne({
                where: { id: data.doctor.id },
                attributes: ["id", "price"],
            });
            if (!staff) {
                return {
                    EC: 200,
                    EM: "Đặt lịch khám thất bại! Không tìm thấy bác sĩ",
                    DT: "",
                }
            }
            if (data.profile.bookFor) {
                console.log("Book for another person");
                let password = "123456";
                let hashPassword = await hashPasswordUser(password);
                user = await db.User.create({
                    password: hashPassword,
                    lastName: data.profile.lastName,
                    firstName: data.profile.firstName,
                    gender: data.profile.gender,
                    cid: data.profile.cid,
                    folk: data.profile.folk,
                    status: status.ACTIVE,
                    roleId: ROLE.PATIENT,
                    dob: new Date(data.profile.dob),
                    currentResident: data.profile.address || null,
                });
            } else {
                user = await db.User.findOne({
                    where: { cid: data.profile.cid },
                });
                let examination = await db.Examination.findAll({
                    where: {
                        userId: user.id,
                        admissionDate: new Date(data.schedule.date),
                        status: status.PENDING,
                    }
                });
                if (examination.length > 0) {
                    return {
                        EC: 200,
                        EM: "Mỗi người dùng chỉ được đặt lịch khám một lần trong ngày",
                        DT: "",
                    }
                }
            }
            if (user && staff) {
                let examination = await db.Examination.create({
                    userId: user.id,
                    staffId: staff.id,
                    symptom: data.profile.symptom,
                    admissionDate: new Date(data.schedule.date),
                    dischargeDate: new Date(data.schedule.date),
                    status: status.PENDING,
                    paymentDoctorStatus: paymentStatus.UNPAID,

                    price: staff.price,
                    special: data?.profile?.special,
                    roomName: data?.schedule?.room?.name || null,

                    // Thông tin cho người đặt trước
                    time: +data.schedule.time.value,
                    visit_status: 0,
                    is_appointment: 1,
                    bookFor: data.profile.bookFor ? data.profile.id : null,
                }, { transaction });
                if (examination) {
                    await transaction.commit();
                    return {
                        EC: 0,
                        EM: "Đặt lịch khám thành công",
                        DT: "",
                    }
                } else {
                    await transaction.rollback();
                    return {
                        EC: 200,
                        EM: "Đặt lịch khám thất bại",
                        DT: "",
                    }
                }
            } else {
                await transaction.rollback();
                return {
                    EC: 200,
                    EM: "Không tìm thấy người dùng",
                    DT: "",
                }
            }
        } else {
            return {
                EC: 200,
                EM: "Quá hạn xác nhận",
                DT: "",
            }
        }
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return ERROR_SERVER;
    }
}
export const getMedicalHistories = async (userId) => {
    try {
        let medicalHistories = await db.User.findAll({
            where: { id: userId },
            include: [
                {
                    model: db.Examination,
                    as: "userExaminationData",
                    where: {
                        status: status.DONE
                    },
                    include: [
                        {
                            model: db.VitalSign,
                            as: 'examinationVitalSignData',
                        },
                        {
                            model: db.Paraclinical,
                            as: 'examinationResultParaclincalData',
                            include: [
                                {
                                    model: db.Room,
                                    as: 'roomParaclinicalData',
                                    attributes: ['id', 'name'],
                                },
                                {
                                    model: db.ServiceType,
                                    as: 'paraclinicalData',
                                    attributes: ['id', 'name', 'price'],
                                }
                            ],
                            separate: true,
                        },
                        {
                            model: db.Prescription,
                            as: 'prescriptionExamData',
                            attributes: ['id', 'note', 'totalMoney'],
                            include: [{
                                model: db.Medicine,
                                as: 'prescriptionDetails',
                                where: {
                                    status: 1
                                },
                                attributes: ['id', 'name', 'price'],
                                through: ['quantity', 'unit', 'dosage', 'price']
                            }],
                        }
                    ],
                    nest: true,
                },
                {
                    model: db.Insurance,
                    as: 'userInsuranceData',
                },
                {
                    model: db.Folk,
                    as: 'folkData'
                }
            ],
            order: [["createdAt", "DESC"]],
        });

        return {
            EC: 0,
            EM: "Lấy thông tin lịch sử khám bệnh thành công",
            DT: medicalHistories,
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