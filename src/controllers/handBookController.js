import handBookService from '../services/handBookService';
import { PAGINATE } from '../utils';

const getAllHandBooks = async (req, res) => {
    try {
        let page = req.query?.page || 1;
        let limit = req.query?.limit || 10;
        let search = req.query?.search || "";
        let staffId = req.query?.staffId || null;
        let filter = req.query?.filter || "";
        let status = req.query?.status || null;
        let response = await handBookService.getAllHandBooks(page, limit, search, staffId, filter, status);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const getHandBooksAdmin = async (req, res) => {
    try {
        let page = parseInt(req.query.page || 1);
        let limit = parseInt(req.query.limit || 10);
        let limitValue = 25;
        for (let i = 0; i < PAGINATE.length; i++) {
            if (PAGINATE[i].id === limit) {
                limitValue = PAGINATE[i].value;
                break;
            }
        }
        let search = req.query.search || "";
        let status = req.query.status || "";
        let filter = req.query.filter || "";
        let response = await handBookService.getHandbookAdmin(page, limitValue, search, status, filter);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const getHandBookById = async (req, res) => {
    try {
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
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const createHandBook = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.title && data.author && data.image
            && data.htmlContent && data.markDownContent) {
            let response = await handBookService.createHandBook(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const updateHandBook = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.title && data.author && data.image
            && data.htmlContent && data.markDownContent) {
            let response = await handBookService.updateHandBook(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const updateHandbookStatus = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.status) {
            let response = await handBookService.updateHandbookStatus(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}
const getHandBookHome = async (req, res) => {
    try {
        let response = await handBookService.getHandBookHome();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}
const getHandBookDeparment = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.departmentId) {
            let response = await handBookService.getHandBookDeparment(data.departmentId);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}
module.exports = {
    getAllHandBooks,
    getHandBooksAdmin,
    getHandBookById,
    createHandBook,
    updateHandBook,
    updateHandbookStatus,
    getHandBookHome,
    getHandBookDeparment,
}