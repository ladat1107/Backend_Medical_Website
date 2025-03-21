import { ERROR_SERVER, ROLE } from '../utils';
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from '../models';
//import { removeVietnameseTones } from '../utils/function';
import { Op } from 'sequelize';
require('dotenv').config();
let API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY is missing! Please check your environment variables.");
}
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `You are Hoa Sen Mini, a medical assistant for Hoa Sen Hospital.  
- Hospital name: Hoa Sen Hospital (working 7am-5pm from Monday to Friday for the outpatient department, 24/7 for the remaining departments)
- Address: 201 Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh  
- Your role: Provide basic medical information, including symptoms, departments, doctors, and hospital details.  
- Language: Answer fluently in the language the user asks.  
- Medical questions should only be suggested, and accompanied by a disclaimer.  
- Respond politely and professionally, always addressing the user by name if provided.
- Answer briefly and accurately to the core of the question.
- Do not answer questions unrelated to current hospital.
`,
});
const MESSAGE_TYPE = {
    COUNT_DEPARTMENTS: {
        type: "COUNT_DEPARTMENTS",
        array: ["bao nhieu khoa", "so khoa", "co bao nhieu khoa", 'may khoa', 'bn khoa', 'nhiu khoa', "nhieu khoa"]
    },
    LIST_DEPARTMENTS: {
        type: "LIST_DEPARTMENTS",
        array: ["danh sach khoa", "cac khoa", "nhung khoa", 'ke ten cac khoa', "ds khoa", "liet ke cac khoa", "liet ke khoa", 'khoa gi', 'khoa nao']
    },
    DEPARTMENT_TREATMENTS: {
        type: "DEPARTMENT_TREATMENTS",
        array: [/khoa\s+([\w\s]+)\s+(tri|dieu\s+tri|chua)\s+(benh\s*)?/i]
    },
    COUNT_DOCTORS_IN_DEPARTMENT: {
        type: "COUNT_DOCTORS_IN_DEPARTMENT",
        array: [
            /khoa\s+([\w\s]+?)\s+(co\s+)?(bao\s+nhieu|may|nhiu|nheu|nhieu)?\s+(bac\s+si|bs)\s(nao\s+)?/i,
            /([\w\s]+?)\s+khoa\s+(co\s+)?(bao\s+nhieu|may|nhiu|nheu|nhieu)\s+(bac\s+si|bs)\s(nao\s+)?/i
        ]
    },
    DOCTORS_TREAT_DISEASE: {
        type: "DOCTORS_TREAT_DISEASE",
        array: [
            /(bac\s+si|bs|ai)\s+(nao\s+)?(tri|dieu\s+tri|chua|chua\s+tri|kham)\s+(benh\s+)?([\w\s]+)/i,
            /(ai)\s+(co\s+the)?\s*(tri|dieu\s+tri|chua|chua\s+tri|kham)\s+(benh\s+)?([\w\s]+)/i
        ]
    },
    UNKNOWN: "UNKNOWN"
}
const removeVietnameseTones = (str) => {
    return str
        .toLowerCase() // Chuyển về chữ thường
        .normalize("NFD") // Chuẩn hóa thành dạng decomposed (tách dấu)
        .replace(/[\u0300-\u036f]/g, "") // Xóa dấu thanh
        .replace(/đ/g, "d").replace(/Đ/g, "D") // Thay thế 'đ' và 'Đ'
        .replace(/[^a-zA-Z0-9\s]/g, "") // Loại bỏ ký tự đặc biệt (giữ số, chữ, khoảng trắng)
        .trim() // Xóa khoảng trắng đầu cuối
        .replace(/\s+/g, " ") // Xóa khoảng trắng thừa ; 
}
const classifyQuestion = (question) => {
    try {
        const normalized = removeVietnameseTones(question);
        for (const key in MESSAGE_TYPE) {
            const { type, array } = MESSAGE_TYPE[key];
            for (const pattern of array) {
                const match = normalized.match(new RegExp(pattern, 'i'));
                if (match) {
                    console.log('Match:', match);
                    let param = null;
                    if (type === MESSAGE_TYPE.COUNT_DOCTORS_IN_DEPARTMENT.type) {
                        param = match[1]?.trim();
                    } else if (type === MESSAGE_TYPE.DOCTORS_TREAT_DISEASE.type) {
                        param = match[match.length - 1]?.trim();
                    } else if (type === MESSAGE_TYPE.DEPARTMENT_TREATMENTS.type) {
                        param = match[1]?.trim();
                    }
                    return { type, param: param };
                }
            }
        }
        return { type: "UNKNOWN" };
    } catch (error) {
        console.log('Error:', error);
        return { type: "UNKNOWN" };
    }
};

// 🚀 Cải thiện hàm getHospitalData để xử lý logic truy vấn tốt hơn
const getHospitalData = async (question) => {
    let { type, param } = classifyQuestion(question);
    console.log('Type:', type, 'Param:', param);
    if (type === MESSAGE_TYPE.COUNT_DEPARTMENTS.type) {
        let departmentCount = await db.Department.count();
        return `Bệnh viện có ${departmentCount} khoa.`;
    }

    if (type === MESSAGE_TYPE.LIST_DEPARTMENTS.type) {
        const rows = await db.Specialty.findAll({ attributes: ['name'] });
        return `Các khoa trong bệnh viện: ${rows.map(r => r.name).join(", ")}.`;
    }

    if (type === MESSAGE_TYPE.DEPARTMENT_TREATMENTS.type) {
        const rows = await db.Specialty.findOne({ where: { name: { [db.Sequelize.Op.like]: `%${param}%` } } });
        if (rows) return `Khoa ${param} điều trị các bệnh: ${rows.shortDescription}.`;
        return `Không tìm thấy thông tin khoa ${param}.`;
    }

    if (type === MESSAGE_TYPE.COUNT_DOCTORS_IN_DEPARTMENT.type) {
        const rows = await db.Department.findAll({
            where: { name: { [Op.like]: `%${param}%` } },
            include: [{
                model: db.Staff, as: "staffDepartmentData",
                attributes: ['id', "position"],
                include: [{
                    model: db.User, as: 'staffUserData',
                    where: { roleId: ROLE.DOCTOR },
                    attributes: ["id", "lastName", "firstName"]
                }],
            }],
            attributes: ['name'],
            raw: true,
            nest: true
        });

        if (!rows.length) {
            return `Không tìm thấy khoa phù hợp ".`;
        }
        return rows;
    }

    if (type === MESSAGE_TYPE.DOCTORS_TREAT_DISEASE.type) {
        try {
            const rows = await db.Staff.findAll({
                include: [{
                    model: db.Specialty, as: 'staffSpecialtyData',
                    where: { shortDescription: { [Op.like]: `%${param}%` } },
                    attributes: ['name'],
                }, {
                    model: db.User, as: 'staffUserData',
                    where: { roleId: ROLE.DOCTOR },
                    attributes: ["id", "lastName", "firstName"]
                }],
                raw: true,
                nest: true
            });
            console.log('Rows:', rows);
            if (!rows.length) { return `Không tìm thấy bác sĩ phù hợp ".`; }
            return rows;
        } catch (error) {
            console.log('Error:', error);
            return null;
        }
    }

    return null;
};


export const messageService = async (message) => {
    try {
        let hospitalResponse = await getHospitalData(message);
        const result = await model.generateContent(hospitalResponse ? `Dựa vào: ${hospitalResponse} . /n Hãy trả lời câu hỏi: ${message}` : message);
        return {
            EC: 0,
            EM: "Success",
            data: result.response.text()
        }
    } catch (error) {
        console.log('Error:', error);
        return ERROR_SERVER;
    }
}

