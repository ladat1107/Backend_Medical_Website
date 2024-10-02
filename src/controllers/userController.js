import userService from '../services/userService'
import { PAGINATE } from '../utils';
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
const handleLogout = (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({
            EC: 0,
            EM: "Đăng xuất thành công",
            DT: ""
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
const handleLogin = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.userLogin || !data.passwordLogin) {
            return res.status(400).json({
                EC: 400,
                EM: "Input is empty",
                DT: ""
            })
        }
        let response = await userService.loginUser(data);
        res.cookie("jwt", response.DT.token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        })
        delete response.DT.token;
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT.user
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
            EM: "Error from server",
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
            EM: "Error from server",
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
            EM: "Error from server",
            DT: ""
        })
    }
}

const createUser = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let arr = ["email", "password", "phoneNumber", "lastName", "firstName", "cid", "dob", "gender", "address", "currentRescident", "roleId",
                "markDownContent", "htmlContent", // description
                "price", "position", "departmentId" // staff
            ];
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
        if (data && data.id && data.email && data.phoneNumber && data.lastName && data.firstName && data.cid
            && data.dob && data.gender && data.address && data.currentRescident && data.roleId
            && data.price && data.position && data.departmentId
            && data.markDownContent && data.htmlContent) {
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
            EM: "Error from server dddd",
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
            EM: "Error from server",
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
                EM: "Input is empty",
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

module.exports = {
    getAllUser,
    getUserById,
    getUserByCid,
    createUser,
    updateUser,
    deleteUser,

    handleRegisterUser,
    handleLogin,
    handleLogout,
    updateFunction,
    deleteFunction,
    getFunctionById,
    handleGetAccount,
    handleConfirm,
}