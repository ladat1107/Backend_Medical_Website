import jwt from "jsonwebtoken";
import { COOKIE, TIME } from "../utils";
require('dotenv').config();
const defaultUrl = ["/", "/registerUser", '/handleLogin', '/handleLogout', '/confirm'];
const createToken = (payload, time) => {
    let key = process.env.SECURITY_KEY;
    let token = null;
    try {
        token = jwt.sign(payload, key, { expiresIn: +time });
    } catch (error) {
        console.log(error);
    }
    return token;
}
const verifyToken = (token) => {
    let key = process.env.SECURITY_KEY;
    let decoded = null;
    try {
        decoded = jwt.verify(token, key);
    } catch (error) {
        console.log(error);
    }
    return decoded;
}
const checkTokenWithCookie = (req, res, next) => {
    if (defaultUrl.includes(req.path)) {
        return next();
    }

    if (req.headers.authorization.split(' ')[1]) {
        let reqToken = req.headers.authorization.split(' ')[1];
        let reqDecoded = verifyToken(reqToken);
        if (reqDecoded !== null) {
            req.user = reqDecoded;
            req.token = reqToken;
            return next();
        } else {
            return res.status(403).json({
                EC: 403,
                EM: "Không có quyền truy cập",
                DT: ""
            });
        }
    } else {
        return res.status(401).json({
            EC: 401,
            EM: "Vui lòng đăng nhập",
            DT: ""
        });
    }


}
const checkAuthentication = (req, res, next) => {
    if (defaultUrl.includes(req.path) || req.path === "/account") {
        return next();
    }
    if (req.user && req.user.groupRole && req.user.groupRole) {
        let roles = req.user.groupRole[0].groupData;
        if (roles && roles.length > 0) {
            let allowedRoles = roles.map(r => r.url);
            if (allowedRoles.includes(req.path)) {
                return next();
            } else {
                return res.status(403).json({
                    EC: 403,
                    EM: "Forbidden " + req.path,
                    DT: ""
                });
            }
        } else {
            return res.status(403).json({
                EC: 403,
                EM: "Forbidden",
                DT: ""
            });
        }
    } else {
        return res.status(401).json({
            EC: 401,
            EM: "Unauthorized",
            DT: ""
        });
    }

}
const refreshToken = (req, res) => {
    try {
        let reqToken = req.cookies[COOKIE.refreshToken];
        if (!reqToken) {
            return res.status(200).json({
                EC: 401,
                EM: "Hêt phiên đăng nhập",
                DT: ""
            });
        }
        let reqDecoded = verifyToken(reqToken);
        if (reqDecoded) {
            let data = {
                id: reqDecoded.id,
                email: reqDecoded.email,
                roleId: reqDecoded.roleId,
            }
            let newToken = createToken(data, TIME.tokenLife);
            return res.status(200).json({
                EC: 0,
                EM: "Refresh token success",
                DT: newToken
            });
        } else {
            return res.status(200).json({
                EC: 401,
                EM: "Lỗi xác thực",
                DT: ""
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server",
            DT: ""
        });
    }
}
module.exports = {
    createToken,
    verifyToken,
    checkTokenWithCookie,
    checkAuthentication,
    refreshToken,
}