import db from "../models";
import { ERROR_SERVER, status } from "../utils";

export const getFolk = async (req, res) => {
    try {
        let folks = await db.Folk.findAll({
            where: {
                status: status.ACTIVE,
            },
        });
        return res.status(200).json({
            EC: 0,
            EM: "Thành công",
            DT: folks,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json(ERROR_SERVER);
    }
}
export const getProvince = async (req, res) => {
    try {
        let provinces = await db.Province.findAll({
            where: {
                status: status.ACTIVE,
            },
        });
        return res.status(200).json({
            EC: 0,
            EM: "Thành công",
            DT: provinces,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}
export const getDistrict = async (req, res) => {
    try {
        let districts = await db.District.findAll({
            where: {
                status: status.ACTIVE,
            },
        });
        return res.status(200).json({
            EC: 0,
            EM: "Thành công",
            DT: districts,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}