import diseaseService, { getAllDisease, getDiseaseByName } from '../services/diseaseService';
import { ERROR_SERVER } from '../utils';

export const getDiseaseByNameController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.name) {
            let response = await getDiseaseByName(data.name);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getAllDiseaseController = async (req, res) => {
    try {
        let response = await getAllDisease();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
