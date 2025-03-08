import db from '../models/index';
import { ERROR_SERVER } from '../utils';
const numberType = {
    priorityNumber: "priorityNumber",
    normalNumber: "normalNumber"
}
export const getTickets = async (req, res) => {
    try {
        let ticket = await db.Ticket.findAll();
        return res.status(200).json({
            EC: 0,
            EM: 'Thành công',
            DT: ticket,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }

}
export const generalNumber = async (req, res) => {
    try {
        let type = req.body?.type;
        if (!type) {
            return res.status(400).json({
                EC: 400,
                EM: "Lỗi ",
                DT: ""
            })
        } else {
            let ticket = await db.Ticket.findAll();
            if (type === numberType.priorityNumber) {
                await db.Ticket.update({
                    priorityNumber: ticket[0].priorityNumber + 1,
                }, {
                    where: {
                        id: ticket[0].id
                    }
                })
                return res.status(200).json({
                    EC: 0,
                    EM: 'Thành công',
                    DT: ticket[0].priorityNumber,
                });
            } else if (type === numberType.normalNumber) {
                await db.Ticket.update({
                    normalNumber: ticket[0].normalNumber + 1,
                }, {
                    where: {
                        id: ticket[0].id
                    }
                })
                return res.status(200).json({
                    EC: 0,
                    EM: 'Thành công',
                    DT: ticket[0].normalNumber,
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)

    }
}
export const generalNumberCurrent = async (req, res) => {
    try {
        let type = req.body?.type;
        if (!type) {
            return res.status(400).json({
                EC: 400,
                EM: "Lỗi ",
                DT: ""
            })
        } else {
            let ticket = await db.Ticket.findAll();

            if (type === numberType.priorityNumber) {
                if (ticket[0].priorityNumberCurrent === ticket[0].priorityNumber) {
                    return res.status(200).json({
                        EC: 200,
                        EM: "Đã hết số",
                        DT: ""
                    })
                }
                await db.Ticket.update({
                    priorityNumberCurrent: ticket[0].priorityNumberCurrent + 1,
                }, {
                    where: {
                        id: ticket[0].id
                    }
                })
                return res.status(200).json({
                    EC: 0,
                    EM: 'Thành công',
                    DT: +ticket[0].priorityNumberCurrent + 1,
                });
            } else if (type === numberType.normalNumber) {
                if (ticket[0].normalNumberCurrent === ticket[0].normalNumber) {
                    return res.status(200).json({
                        EC: 200,
                        EM: "Đã hết số",
                        DT: ""
                    })
                }
                await db.Ticket.update({
                    normalNumberCurrent: ticket[0].normalNumberCurrent + 1,
                }, {
                    where: {
                        id: ticket[0].id
                    }
                })
                return res.status(200).json({
                    EC: 0,
                    EM: 'Thành công',
                    DT: +ticket[0].normalNumberCurrent + 1,
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)

    }
}
