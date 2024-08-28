import db from "../models/index";

const getGroupWithRole = async (user) => {
    try {
        let groupRole = await db.Group.findAll({
            where: { id: user.groupId },
            attributes: ["id", "name", "description"],
            include: [
                {
                    model: db.Role, as: "groupData",
                    attributes: ["id", "url", "description"],
                    through: { attributes: [] },
                }
            ],
            raw: false,
            nest: true,
        });
        return groupRole;
    } catch (error) {
        console.log(error);
        return [];
    }
}
module.exports = {
    getGroupWithRole,
}