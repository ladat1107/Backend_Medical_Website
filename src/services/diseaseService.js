import db from "../models/index";
import { status } from "../utils/index";
const { Op } = require('sequelize');

const getDiseaseByName = async (name) => {
    try {
        let diseases = await db.Disease.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                },
                status: status.ACTIVE
            },
            attributes: ['code', 'name'],
            raw: true,
            nest: true
        });
        if(diseases.length === 0){
            return {
                EC: 404,
                EM: "Không tìm thấy bệnh",
                DT: ""
            }
        }
        const formattedDiseases = diseases.map(disease => ({
            disease: `${disease.code} - ${disease.name}`
        }));

        return {
            EC: 0,
            EM: "Lấy thông tin bệnh thành công",
            DT: formattedDiseases
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}

module.exports = {
    getDiseaseByName
}