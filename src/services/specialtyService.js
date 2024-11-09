import db from "../models";

let getSpecialtySelect = async () => {
    try {
        let specialtyData = await db.Specialty.findAll({
            where: { status: 1 },
            attributes: [
                ['id', 'value'],
                ['name', 'label']
            ]
        });
        return {
            EC: 0,
            EM: "Lấy thông tin chuyên khoa thành công",
            DT: specialtyData
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }

    }
}
module.exports = {
    getSpecialtySelect
}