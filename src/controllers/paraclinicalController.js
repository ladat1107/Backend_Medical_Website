import paraclinicalService from '../services/paraclinicalService';

const getParaclinicalByExamId = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.examinationId) {
            let response = await paraclinicalService.getParaclinicalByExamId(data.examinationId);
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
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const createParaclinical = async (req, res) => {
    try{
        let data = req.body;
        if(data && data.examinationId && data.paraclinical && data.description 
            && data.result && data.image && data.price) {
            let response = await paraclinicalService.createParaclinical(data);
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
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const updateParaclinical = async (req, res) => {
    try{
        let data = req.body;
        if(data && data.id && data.paraclinical && data.description 
            && data.result && data.image && data.price) {
            let response = await paraclinicalService.updateParaclinical(data);
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
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const deleteParaclinical = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.id) {
            let response = await paraclinicalService.deleteParaclinical(data.id);
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
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

module.exports = {
    getParaclinicalByExamId,
    createParaclinical,
    updateParaclinical,
    deleteParaclinical
}