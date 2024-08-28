import jwt from "jsonwebtoken";
require('dotenv').config();
const defaultUrl = ["/", "/registerUser", '/handleLogin', '/handleLogout'];
const createToken = (payload) => {
    let key = process.env.SECURITY_KEY;

    let token = null;
    try {
        token = jwt.sign(payload, key, { expiresIn: 10000 });
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

    if ((req.cookies && req.cookies.jwt) || req.headers.authorization.split(' ')[1]) {
        let reqToken = req.cookies.jwt || req.headers.authorization.split(' ')[1];
        let reqDecoded = verifyToken(reqToken);
        if (reqDecoded !== null) {
            req.user = reqDecoded;
            req.token = reqToken;
            return next();
        } else {
            return res.status(401).json({
                EC: 401,
                EM: "Unauthorized",
                DT: ""
            });
        }
    } else {
        return res.status(401).json({
            EC: 401,
            EM: "Please login again...",
            DT: ""
        });
    }


}
const checkAuthentication = (req, res, next) => {
    if (defaultUrl.includes(req.path) || req.path === "/account") {
        return next();
    }
    if (req.user && req.user.groupRole && req.user.groupRole) {
        let role = req.user.groupRole[0].groupData;
        if (role && role.length > 0) {
            let allowedRoles = role.map(r => r.url);
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
module.exports = {
    createToken,
    verifyToken,
    checkTokenWithCookie,
    checkAuthentication,
}