import { blockUser, confirmBooking, confirmTokenBooking, confirmUser, createUser, deleteUser, forgotPassword, getAllUser, getDoctorHome, getMedicalHistories, getUserByCid, getUserById, getUserInsuarance, loginGoogle, loginUser, registerUser, updateProfileInfor, updateProfilePassword, updateUser } from '../services/userService';
import { COOKIE, ERROR_SERVER, ROLE, TIME } from '../utils';
require('dotenv').config();
export const handleRegisterUserController = async (req, res) => {
    try {
        let data = req.body
        if (!data || !data.email || !data.password || !data.lastName || !data.firstName || !data.phoneNumber || !data.cid) {
            return res.status(200).json({
                EC: 400,
                EM: "Yêu cầu của bạn không đủ thông tin!",
                DT: ""
            })
        }
        let response = await registerUser(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }

}
export const handleConfirmController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.token) {
            let response = await confirmUser(data.token);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Yêu cầu của bạn không đủ thông tin!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const handleForgotPasswordController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.email) {
            let response = await forgotPassword(data.email);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Yêu cầu của bạn không đủ thông tin!",
                DT: ""
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const handleLoginController = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.email || !data.password) {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
        let response = await loginUser(data);
        res.cookie(COOKIE.refreshToken, response.DT.refreshToken, {
            httpOnly: true,
            maxAge: TIME.cookieLife
        })
        delete response.DT.refreshToken;
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const handleLoginGoogleController = async (req, res) => {
    try {
        let response = await loginGoogle(req?.user?._json, req?.user?.id);
        res.cookie(COOKIE.refreshToken, response.DT.refreshToken, {
            httpOnly: true,
            maxAge: TIME.cookieLife
        })
        delete response.DT.refreshToken;
        let dataCustom = JSON.stringify(response.DT);
        return res.redirect(`${process.env.REACT_APP_BACKEND_URL}/login?google=${dataCustom}`);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getAllUserController = async (req, res) => {
    try {
        let page = req.query?.page || 1;
        let limit = req.query?.limit || 25;
        let search = req.query.search;
        let position = req.query.position;
        if (position.includes('[') && position.includes(']')) {
            position = JSON.parse(position);
        } else {
            position = [];
        }
        let response = await getAllUser(page, limit, search, position);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getUserByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            if (data.id === "null") {
                data.id = req.user.id;
            }
            let response = await getUserById(data.id);
            return res.status(200).json(response)
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getUserByCidController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.cid) {
            let response = await getUserByCid(data.cid);
            return res.status(200).json(response)
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const createUserController = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let arr = ["lastName", "firstName", "cid", "roleId"];
            if ([3, 4, 5, 6, 7].includes(data.roleId)) {
                arr.push("phoneNumber", "email", "departmentId")
                data.staff = true;
            }
            for (let i = 0; i < arr.length; i++) {
                if (!data[arr[i]]) {
                    return res.status(400).json({
                        EC: 400,
                        EM: `Dữ liệu ${arr[i]} không được để trống`,
                        DT: ""
                    })
                }
            }

            let response = await createUser(data);
            return res.status(200).json(response)
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const updateUserController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await updateUser(data);
            return res.status(200).json(response)
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server! dddd",
            DT: ""
        })
    }
}
export const blockUserController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await blockUser(data);
            return res.status(200).json(response)
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(ERROR_SERVER)
    }
}
export const deleteUserController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await deleteUser(data.id);
            return res.status(200).json(response)
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getDoctorHomeController = async (req, res) => {
    try {
        let response = await getDoctorHome(req.query);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const profileInforController = async (req, res) => {
    try {
        let data = req.body;
        if (data.id === "null") {
            data.id = req.user.id;
        }
        let response = await updateProfileInfor(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const profilePasswordController = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.id || !data.oldPassword || !data.newPassword) {
            return res.status(200).json({
                EC: 400,
                EM: "Yêu cầu của bạn không đủ thông tin!",
                DT: ""
            })
        }
        let response = await updateProfilePassword(data);
        res.cookie(COOKIE.refreshToken, response.DT.refreshToken, {
            httpOnly: true,
            maxAge: TIME.cookieLife
        })
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: ""
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getUserInsuaranceController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await getUserInsuarance(data.userId);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json(ERROR_SERVER)
    }
}
export const confirmBookingController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.profile && data.doctor && data.schedule) {
            let response = await confirmBooking(data);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json(ERROR_SERVER)
    }
}
export const confirmTokenBookingController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.token) {
            let response = await confirmTokenBooking(data.token);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Không thể xác nhận lịch khám!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json(ERROR_SERVER)
    }
}

export const getMedicalHistoriesController = async (req, res) => {
    try {
        let userId = req.user.roleId === ROLE.PATIENT ? req?.user?.id : req?.query?.userId;
        let response = await getMedicalHistories(userId);
        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
        return res.status(200).json(ERROR_SERVER)
    }
}
