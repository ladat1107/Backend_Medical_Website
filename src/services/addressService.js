import db from "../models";
import { status } from "../utils";

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
        return res.status(500).json({
            EC: 500,
            EM: "Có lỗi xảy ra",
            DT: "",
        });
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
        return res.status(500).json({
            EC: 500,
            EM: "Có lỗi xảy ra",
            DT: "",
        });
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
        return res.status(500).json({
            EC: 500,
            EM: "Có lỗi xảy ra",
            DT: "",
        });
    }
}

// let custom = []
// for (let i = 0; i < data.length; i++) {
//     custom.push({
//         id: +data[i].id,
//         nameVi: data[i].full_name,
//         nameEn: data[i].full_name_en,
//         longitude: +data[i].longitude,
//         latitude: +data[i].latitude,
//         status: 1
//     })
// }
// let provinces = await db.Province.bulkCreate(custom);
// return res.status(200).json({
//     EC: 0,
//     EM: "Thành công",
//     DT: provinces,
// });