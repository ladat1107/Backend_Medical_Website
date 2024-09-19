import handBookService from '../services/handBookService';

const getAllHandBooks = async (req, res) => {
    try{
        let response = await handBookService.getAllHandBooks();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const getHandBooksByStatus = async (req, res) => {
    try{
        let data = req.query;
        if (data && data.status) {
            let response = await handBookService.getHandBooksByStatus(data.status);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
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

const getHandBookById = async (req, res) => {
    try{
        let data = req.query;
        if (data && data.id) {
            let response = await handBookService.getHandBookById(data.id);
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

const createHandBook = async (req, res) => {
    try{
        let data = req.body;
        if (data && data.title && data.author && data.image && data.htmlContent && data.markDownContent){
            let response = await handBookService.createHandBook(data);
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

const updateHandBook = async (req, res) => {
    try{
        let data = req.body;
        if (data && data.id && data.title && data.author && data.image && data.htmlContent && data.markDownContent){
            let response = await handBookService.updateHandBook(data);
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

const updateHandbookStatus = async (req, res) => {
    try{
        let data = req.body;
        if (data && data.id && data.status){
            let response = await handBookService.updateHandbookStatus(data);
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
    getAllHandBooks,
    getHandBooksByStatus,
    getHandBookById,
    createHandBook,
    updateHandBook,
    updateHandbookStatus
}