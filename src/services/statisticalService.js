import { Op, where } from "sequelize";
import db from "../models/index";
import { status } from "../utils";
import dayjs from "dayjs";

export const getStatisticalAppoinment = async (req, res) => {
    try {
        let startDate = dayjs().startOf('day').toISOString();
        let endDate = dayjs().endOf('day').toISOString();
        let appoinment = await db.Examination.findAll({
            where: {
                admissionDate: { [Op.between]: [startDate, endDate] },
            },
        })
        let medicine = await db.Medicine.findAll({
            include: [
                {
                    model: db.Prescription,
                    as: 'prescriptionData',
                    include: [
                        {
                            model: db.Examination,
                            as: 'prescriptionExamData',
                            where: {
                                admissionDate: { [Op.between]: [startDate, endDate] },
                            },
                            required: true,
                            attributes: ["id", "admissionDate", "dischargeDate"],
                        }
                    ],
                    required: true,
                    through: {
                        attributes: ["quantity"]
                    },
                    attributes: ["id"]
                },
            ],
            attributes: ["id", "name", "price", "inventory"]
        })

        return res.status(200).json({
            EC: 0,
            EM: "Thành công",
            DT: {
                appoinment: appoinment,
                medicine: medicine
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            EC: 1,
            EM: "Lỗi hệ thống",
            DT: null
        })

    }
}