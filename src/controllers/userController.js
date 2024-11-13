import userService from '../services/userService'
import { COOKIE, PAGINATE, ROLE, TIME } from '../utils';
const handleRegisterUser = async (req, res) => {
    try {
        let data = req.body
        if (!data || !data.email || !data.password || !data.lastName || !data.firstName || !data.phoneNumber || !data.cid || !data.currentResident || !data.dob) {
            return res.status(200).json({
                EC: 400,
                EM: "Yêu cầu của bạn không đủ thông tin!",
                DT: ""
            })
        }
        let response = await userService.registerUser(data);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        })
    }

}
const handleConfirm = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.confirm) {
            let response = await userService.confirmUser(data.confirm);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Yêu cầu của bạn không đủ thông tin!",
                DT: ""
            })
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
const handleLogin = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.email || !data.password) {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
        let response = await userService.loginUser(data);
        res.cookie(COOKIE.refreshToken, response.DT.refreshToken, {
            httpOnly: true,
            maxAge: TIME.cookieLife
        })
        delete response.DT.refreshToken;
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        })
    }
}
const getAllUser = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            let limitValue = 25;
            for (let i = 0; i < PAGINATE.length; i++) {
                if (PAGINATE[i].id === limit) {
                    limitValue = PAGINATE[i].value;
                    break;
                }
            }
            let search = req.query.search;
            let position = req.query.position;
            if (position.includes('[') && position.includes(']')) {
                position = JSON.parse(position);
            } else {
                position = [];
            }
            let response = await userService.getAllUser(page, limitValue, search, position);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const getUserById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await userService.getUserById(data.id);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const getUserByCid = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.cid) {
            let response = await userService.getUserByCid(data.cid);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const createUser = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let arr = ["email", "password", "phoneNumber", "lastName", "firstName", "cid", "roleId",
            ];
            if ([3, 4, 5, 6, 7].includes(data.roleId)) {
                arr.push("markDownContent", "departmentId")
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

            let response = await userService.createUser(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
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
const updateUser = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await userService.updateUser(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
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
            EM: "Hệ thống quá tải! dddd",
            DT: ""
        })
    }
}
const blockUser = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await userService.blockUser(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
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
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await userService.deleteUser(data.id);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
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
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const updateFunction = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let arr = ["id", "userName", "email", "phoneNumber", "gender", "groupId"];
            for (let i = 0; i < arr.length; i++) {
                if (!data[arr[i]]) {
                    return res.status(400).json({
                        EC: 400,
                        EM: `Dữ liệu ${arr[i]} không được để trống`,
                        DT: ""
                    })
                }
            }
            let response = await userService.updateFunction(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
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
const deleteFunction = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await userService.deleteFunction(data.id);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        })
    }
}
const getFunctionById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await userService.getFunctionById(data.id);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Không tìm thấy người dùng",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        })
    }
}
const handleGetAccount = async (req, res) => {
    try {
        if (req.user && req.token) {
            console.log("Check account: ", req.user);
            return res.status(200).json({
                EC: 200,
                EM: "Success",
                DT: {
                    token: req.token,
                    user: req.user
                }
            })
        } else {
            return res.status(401).json({
                EC: 401,
                EM: "Unauthorized",
                DT: ""
            })
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
const getDoctorHome = async (req, res) => {
    try {
        let response = await userService.getDoctorHome();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        })
    }
}
const profileInfor = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.id) {
            return res.status(200).json({
                EC: 400,
                EM: "Yêu cầu của bạn không đủ thông tin!",
                DT: ""
            })
        }
        let response = await userService.updateProfileInfor(data);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        })
    }
}
const profilePassword = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.id || !data.oldPassword || !data.newPassword) {
            return res.status(200).json({
                EC: 400,
                EM: "Yêu cầu của bạn không đủ thông tin!",
                DT: ""
            })
        }
        let response = await userService.updateProfilePassword(data);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        })
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

    handleRegisterUser,
    handleLogin,
    updateFunction,
    deleteFunction,
    getFunctionById,
    handleGetAccount,
    handleConfirm,
    getDoctorHome,
    profileInfor,
    profilePassword

}