import diseaseService from '../services/diseaseService';

const getDiseaseByName = async (req, res) => {
    try {
        let data = req.query;
        if(data && data.name){
            let response = await diseaseService.getDiseaseByName(data.name);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Input is empty",
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

const getAllDisease = async (req, res) => {
    try {
        let response = await diseaseService.getAllDisease();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
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
    getDiseaseByName,
    getAllDisease
}