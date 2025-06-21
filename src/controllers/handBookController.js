import { createHandBook, getAllHandBooks, getHandbookAdmin, getHandBookById, getHandBookHome, updateHandBook, updateHandbookStatus } from '../services/handBookService';
import { ERROR_SERVER, ROLE } from '../utils';

export const getAllHandBooksController = async (req, res) => {
    try {
        let page = req.query?.page || 1;
        let limit = req.query?.limit || 12;
        let search = req.query?.search || "";
        let staffId = req.user.staff;
        let filter = req.query?.filter || "";
        let status = req.query?.status || null;
        let response = await getAllHandBooks(page, limit > 500 ? 12 : limit, search, staffId, filter, status);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getHandBooksAdminController = async (req, res) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 12;
        let search = req.query.search || "";
        let status = req.query.status || "";
        let filter = req.query.filter || "";
        let response = await getHandbookAdmin(page, limit, search, status, filter);
        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getHandBookByIdController = async (req, res) => {
    try {
        let data = req.query;
        let role = req?.user?.roleId || ROLE.PATIENT;
        if (data && data.id) {
            let response = await getHandBookById(data.id, role);
            return res.status(200).json(response)
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

export const createHandBookController = async (req, res) => {
    try {
        let data = req.body;
        data.author = req.user.staff;
        if (data && data.title && data.author && data.image
            && data.htmlDescription) {
            let response = await createHandBook(data);
            return res.status(200).json(response)
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

export const updateHandBookController = async (req, res) => {
    try {
        let data = req.body;
        data.author = req.user.staff;
        if (data && data.id && data.title && data.author && data.image
            && data.htmlDescription) {
            let response = await updateHandBook(data);
            return res.status(200).json(response)
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

export const updateHandbookStatusController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.status) {
            let response = await updateHandbookStatus(data);
            return res.status(200).json(response)
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
export const getHandBookHomeController = async (req, res) => {
    try {
        let response = await getHandBookHome(req.query);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

// export const getHandBookDeparmentController = async (req, res) => {
//     try {
//         let data = req.query;
//         if (data && data.departmentId) {
//             let response = await getHandBookDeparment(data.departmentId);
//             return res.status(200).json({
//                 EC: response.EC,
//                 EM: response.EM,
//                 DT: response.DT
//             })
//         } else {
//             return res.status(200).json({
//                 EC: 400,
//                 EM: "Dữ liệu không được trống!",
//                 DT: ""
//             })
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(ERROR_SERVER)
//     }
// }
