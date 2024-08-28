import userService from '../services/userService'
const handleRegisterUser = async (req, res) => {
    try {
        let data = req.body
        if (!data || !data.email || !data.password || !data.userName || !data.phoneNumber) {
            return res.status(200).json({
                EC: 400,
                EM: "Input is empty",
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
            EM: "Error from server",
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
            EM: "Error from server",
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
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}
const getFunction = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            let response = await userService.getFunction(page, limit);
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
const createFunction = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let arr = ["userName", "password", "email", "phoneNumber", "gender", "groupId"];
            for (let i = 0; i < arr.length; i++) {
                if (!data[arr[i]]) {
                    return res.status(400).json({
                        EC: 400,
                        EM: `Dữ liệu ${arr[i]} không được để trống`,
                        DT: ""
                    })
                }
            }
            let response = await userService.createFunction(data);
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
            EM: "Error from server",
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
            EM: "Error from server",
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
            EM: "Error from server",
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
            EM: "Error from server",
            DT: ""
        })
    }
}
module.exports = {
    handleRegisterUser,
    handleLogin,
    handleLogout,
    getFunction,
    createFunction,
    updateFunction,
    deleteFunction,
    getFunctionById,
    handleGetAccount,
}