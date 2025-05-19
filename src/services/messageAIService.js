import { ERROR_SERVER, ROLE, status } from '../utils';
import { GoogleGenerativeAI } from "@google/generative-ai";
import db, { Sequelize } from '../models';
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
- Language: Answer flexibility in the language the user asks.  
- Medical questions should only be suggested, and accompanied by a disclaimer, Suggested messages to reception staff.  
- Respond politely and professionally, always addressing the user by name if provided.
- Answer briefly and accurately to the core of the question.
- Do not answer questions unrelated to current hospital. 
- Say hello only the first time, not in the middle of a conversation.
`,
});
const MESSAGE_TYPE = {
    LIST_DEPARTMENTS: "LIST_DEPARTMENTS",
    DOCTOR_DETAIL: "DOCTOR_DETAIL",
    DEPARTMENT_DETAIL: "DEPARTMENT_DETAIL",
    DOCTOR_LIST_IN_DEPARTMENT: "DOCTOR_LIST_IN_DEPARTMENT",
    COUNT_DOCTORS_IN_DEPARTMENT: "COUNT_DOCTORS_IN_DEPARTMENT",
    DOCTOR_LIST_IN_HOSPITAL: "DOCTOR_LIST_IN_HOSPITAL",
    DOCTOR_LIST_OF_SPECIALTY: "DOCTOR_LIST_OF_SPECIALTY",
    SUGGEST_MESSAGE_TO_RECEPTION: "SUGGEST_MESSAGE_TO_RECEPTION",
    INSTRUCTION_FOR_MAKING_APPOINTMENT: "INSTRUCTION_FOR_MAKING_APPOINTMENT",
    UNKNOWN: "UNKNOWN",
}
const typemessage = async (question) => {
    try {
        const prompt = `
        Classify the following medical question into one of these types and extract any relevant parameter.
        Types:
        - ${MESSAGE_TYPE.LIST_DEPARTMENTS}: Questions asking to list all departments or count the number of departments
        - ${MESSAGE_TYPE.DEPARTMENT_DETAIL}: Questions about what a department detail (parameter: department vietnamese name without "khoa")
        - ${MESSAGE_TYPE.DOCTOR_DETAIL}: Questions about what a doctor detail (parameter: doctor vietnamese name without "bác sĩ" or "bs"), or questions asking for instructions on how to make an appointment without mentioning the name of the doctor or department
        - ${MESSAGE_TYPE.DOCTOR_LIST_IN_DEPARTMENT}: Questions about how many staff or doctor work in a specific department (parameter: vietnamese name without "khoa")
        - ${MESSAGE_TYPE.DOCTOR_LIST_IN_HOSPITAL}:  Questions asking to list all doctors (staffs, employees) or count the number of doctors(staffs, employees) in the hospital
        - ${MESSAGE_TYPE.DOCTOR_LIST_OF_SPECIALTY}: Questions asking for doctors who treat specific **symptoms** or **conditions** (e.g., "đau bụng", "nhức chân", "đau đầu"). These questions typically contain references to physical symptoms, discomfort, or disease-related keywords. (parameter: extract the symptom or condition mentioned in the question).
        - ${MESSAGE_TYPE.SUGGEST_MESSAGE_TO_RECEPTION}: Questions asking to suggest a message to reception staff
        - ${MESSAGE_TYPE.INSTRUCTION_FOR_MAKING_APPOINTMENT}: Questions asking for instructions on how to make an appointment without mentioning the name of the doctor or department
        - ${MESSAGE_TYPE.UNKNOWN}: Questions that do not fit any of the above categories
        Question: "${question}"
        
        Return only a JSON object with this exact format (no other text):
        {"type": "ONE_OF_THE_TYPES_ABOVE", "param": "extracted parameter if applicable, otherwise empty string (Can take parameters from previous question information if appropriate for the context)"}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        try {
            // Extract JSON from the response (in case Gemini adds extra text)
            const jsonMatch = responseText.match(/\{.*\}/s);
            if (jsonMatch) {
                console.log('Response:', JSON.parse(jsonMatch[0]));
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(responseText); // Try parsing the whole response if no clear JSON is found
        } catch (e) {
            console.log('Error parsing JSON:', e, 'Response was:', responseText);
            return { type: null, param: "" };
        }
    } catch (error) {
        console.log('Error classifying with Gemini:', error);
        return { type: null, param: "" };
    }
}

const getHospitalData = async (type, param) => {
    try {
        if (type === MESSAGE_TYPE.LIST_DEPARTMENTS) {
            let departmentCount = await db.Department.count();
            return {
                text: `Hiện tại Bệnh viện Hoa Sen có ${departmentCount} khoa.`,
                link: [{ name: "Xem các khoa", url: "/departmentList" }]
            }
        }

        if (type === MESSAGE_TYPE.DEPARTMENT_DETAIL) {
            let findOne = await findInformationDepartmentExactly(param);
            if (!findOne) {
                return await findInformationDepartmentIncludeName(param);
            } else {
                return {
                    text: `Khoa ${findOne?.name} hiện tại có ${findOne?.staffDepartmentData?.length} nhân viên và ${findOne?.deanDepartmentData ? findOne?.deanDepartmentData?.staffUserData?.lastName + " " + findOne?.deanDepartmentData?.staffUserData?.firstName + " là trưởng khoa hiện tại" : " hiện tại chưa có trưởng khoa"}\n ${findOne}`,
                    link: [{ name: `Chi tiết khoa ${findOne?.name}`, url: `/departmentDetail/${findOne.id}` }]
                }
            }
        }
        if (type === MESSAGE_TYPE.DOCTOR_LIST_IN_DEPARTMENT) {
            let findOne = await findInformationDepartmentExactly(param);
            if (!findOne) {
                return await findInformationDepartmentIncludeName(param);
            } else {
                return {
                    text: `Khoa ${findOne?.name} hiện tại có ${findOne?.staffDepartmentData?.length} nhân viên và ${findOne?.deanDepartmentData ? findOne?.deanDepartmentData?.staffUserData?.lastName + " " + findOne?.deanDepartmentData?.staffUserData?.firstName + " là trưởng khoa hiện tại" : " hiện tại chưa có trưởng khoa"}\nDanh sách nhân viên:\n
                     ${findOne?.staffDepartmentData?.map((row, index) => (
                        `<a href="${row?.staffUserData?.roleId === 3 ? `/doctor-detail/${row?.userId}` : "#"}" >${index + 1}. ${row?.position ? row.position : "Điều dưỡng "} ${row?.staffUserData?.lastName} ${row?.staffUserData?.firstName}</a>`
                    )).join("<br/>")}  `,
                    link: []
                }
            }
        }
        if (type === MESSAGE_TYPE.DOCTOR_DETAIL) {
            return await findInformationDoctorExactly(param);
        }
        if (type === MESSAGE_TYPE.DOCTOR_LIST_IN_HOSPITAL) {
            return await findInformationStaffInHospital();
        }
        if (type === MESSAGE_TYPE.DOCTOR_LIST_OF_SPECIALTY) {
            return await findDoctorBySymptom(param);
        }
        if (type === MESSAGE_TYPE.INSTRUCTION_FOR_MAKING_APPOINTMENT) {
            return {
                text: `Bạn có thể đặt lịch khám tại bệnh viện Hoa Sen qua hotline: <b>0353366459</b>, hoặc đặt lịch bằng website bằng cách nhấn nút "Đặt lịch khám" dưới đây.`,
                link: [{ name: "Đặt lịch khám", url: "/make-appointment" }]
            }
        }
        if (type === MESSAGE_TYPE.SUGGEST_MESSAGE_TO_RECEPTION) {
            return {
                text: `Bạn có thể nhắn tin với nhân viên tiếp nhận để được hỗ trợ.`,
                action: "Nhắn tin với tiếp nhận viên"
            }
        }
        return null;
    } catch (error) {
        console.log('Error:', error);
        return null;
    }

};

// Hàm tạo prompt thông minh dựa vào lịch sử chat để giữ ngữ cảnh
const createSmartPrompt = (history, userMessage) => {
    return `Đây là đoạn hội thoại trước đó giữa người dùng và bot:
    ${history.map(entry => `${entry.sender === 'bot' ? 'Bot' : 'User'}: ${entry.text}`).join('\n')}
    
    Hiện tại, người dùng vừa hỏi: "${userMessage}"
    Hãy cố gắng dựa vào ngữ cảnh trước đó để đưa ra câu trả lời chính xác. Nếu cần, hãy yêu cầu thêm thông tin hoặc giải thích rõ ràng.`;
}
const createPromptAfterQuery = (history, userMessage, responseText) => {
    return `Đây là đoạn hội thoại trước đó giữa người dùng và bot:
    ${history.map(entry => `${entry.sender === 'bot' ? 'Bot' : 'User'}: ${entry.text}`).join('\n')}
    
    Hiện tại, người dùng vừa hỏi: "${userMessage}"
    Dữ liệu tôi vừa truy vấn dưới database: "${responseText}"
    Hãy cố gắng dựa vào ngữ cảnh trước đó để đưa ra câu trả lời chính xác. Nếu cần, hãy yêu cầu thêm thông tin hoặc giải thích rõ ràng.`;
};
export const messageAIService = async (message, history) => {
    try {
        let prompt = createSmartPrompt(history, message);
        let { type, param } = await typemessage(prompt);
        let result = null;
        if (type === MESSAGE_TYPE.UNKNOWN) {
            let responseText = await model.generateContent(prompt);
            result = {
                text: responseText.response.text(), link: []
            }
        } else {
            let dataAnswer = await getHospitalData(type, param);
            let chatbotResponse = await model.generateContent(createPromptAfterQuery(history, message, dataAnswer.text));
            result = {
                text: chatbotResponse.response.text(),
                link: dataAnswer.link,
                action: dataAnswer?.action || undefined
            }
        }
        return {
            EC: 0, EM: "Success", DT: result
        }
    } catch (error) {
        console.log('Error:', error);
        return ERROR_SERVER;
    }
}

const findInformationDepartmentExactly = async (param) => {
    try {
        let findOne = await db.Department.findOne({
            where: { name: param },
            include: [
                {
                    model: db.Staff, as: "staffDepartmentData",
                    include: [{
                        model: db.User,
                        as: 'staffUserData',
                        attributes: ['firstName', 'lastName', 'roleId'],
                    }]
                },
                {
                    model: db.Staff,
                    as: 'deanDepartmentData',
                    include: [{
                        model: db.User,
                        as: 'staffUserData',
                        attributes: ['firstName', 'lastName'],
                    }]
                }
            ],
        });
        return findOne;
    } catch (error) {
        console.log('Error:', error);
        return null;
    }
}

const findInformationDepartmentIncludeName = async (param) => {
    try {
        let findAll = await db.Department.findAll({
            where: { name: { [Op.like]: `% ${param} %` } },
            include: [
                {
                    model: db.Staff, as: "staffDepartmentData"
                },
                {
                    model: db.Staff,
                    as: 'deanDepartmentData',
                    include: [{
                        model: db.User,
                        as: 'staffUserData',
                        attributes: ['firstName', 'lastName'],
                    }]
                }
            ],
        });
        if (findAll.length === 0) {
            return { text: `Không tìm thấy thông tin khoa ${param}.`, link: null };
        }
        if (findAll.length === 1) {
            let department = { ...findAll[0], raw: true, nest: true };
            // return {
            //     text: `Khoa ${findAll[0]?.name} hiện tại có <strong>${department?.staffDepartmentData?.length}</strong> nhân viên và <strong>${department?.deanDepartmentData ? department?.deanDepartmentData?.staffUserData?.lastName + " " + department?.deanDepartmentData?.staffUserData?.firstName + " là trưởng khoa" : " hiện tại chưa có trưởng khoa"}</strong>\n ${findAll[0].shortDescription}`,
            //     link: [{ name: `Chi tiết khoa ${findAll[0]?.name}`, url: `/department/${findAll[0].id}` }]
            // }
            return {
                text: findAll,
                link: [{ name: `Chi tiết khoa ${findAll[0]?.name}`, url: `/department/${findAll[0].id}` }]
            }
        }
        if (findAll.length > 1) {
            let link = findAll.map(row => ({ name: `Xem chi tiết khoa ${row.name}`, url: `/departmentDetail/${row.id}` }));
            // return {
            //     text: `Tìm thấy ${findAll.length} khoa phù hợp.`,
            //     link: link
            // }
            return {
                text: `Tìm thấy ${findAll.length} khoa phù hợp.
                ${findAll}`,
                link: link
            }
        }
    } catch (error) {
        console.log('Error:', error);
        return { text: `Không tìm thấy thông tin khoa ${param}.`, link: [] };
    }
}

const findInformationStaffInHospital = async () => {
    try {
        const staff = await db.Staff.findAll({
            include: [{
                model: db.User, as: 'staffUserData',
                where: { status: status.ACTIVE },
                attributes: ["id", "lastName", "firstName", "roleId"]
            }],
        })
        let countDoctor = 0;
        let countNurse = 0;
        let countAccountant = 0;
        let countPharmacist = 0;
        let countReceptionist = 0;

        staff.forEach(element => {
            if (+element.staffUserData.roleId === ROLE.DOCTOR) {
                countDoctor++;
            }
            if (+element.staffUserData.roleId === ROLE.NURSE) {
                countNurse++;
            }
            if (+element.staffUserData.roleId === ROLE.ACCOUNTANT) {
                countAccountant++;
            }
            if (+element.staffUserData.roleId === ROLE.PHARMACIST) {
                countPharmacist++;
            }
            if (+element.staffUserData.roleId === ROLE.RECEPTIONIST) {
                countReceptionist++;
            }
        });
        return {
            text: `Bệnh viện Hoa Sen hiện tại có <strong> ${staff.length}</strong> nhân sự gồm nhiều chức vụ khác nhau bao gồm:
            ${countDoctor} bác sĩ 
            ${countNurse} điều dưỡng
            ${countAccountant} kế toán
            ${countPharmacist} dược sĩ
            ${countReceptionist} lễ tân ${staff.length - (countDoctor + countNurse + countAccountant + countPharmacist + countReceptionist) > 0 ? "\n Ngoài ra, còn có các cán bộ, nhân sự khác phụ trách vận hành." : ""}`,
            link: [{ name: "Danh sách bác sĩ của Hoa Sen", url: "/doctor-list" }]
        }
    } catch (error) {
        console.log('Error:', error);
        return { text: "Bạn có thể tham khảo thông tin nhân sự tại bệnh viện Hoa Sen tại đây: ", link: [{ name: "Danh sách bác sĩ của Hoa Sen", url: "/doctor-list" }] };
    }
}

const findDoctorBySymptom = async (param) => {
    try {
        if (!param) return { text: "Không tìm thấy thông tin bác sĩ phù hợp. Bạn có thể cung cấp thêm thông tin cụ thể bác sĩ cần tìm hoặc nhắn tin với tiếp nhận để có câu trả lời cụ thể nhất!", link: null };
        let doctor = await db.Specialty.findAll({
            where: {
                status: status.ACTIVE,
                [Op.or]: [
                    { name: { [Op.like]: `% ${param} %` } },
                    { shortDescription: { [Op.like]: `% ${param} %` } }
                ]
            },
            include: [{
                model: db.Staff,
                as: 'staffSpecialtyData',
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    where: {
                        status: status.ACTIVE,
                        roleId: ROLE.DOCTOR
                    },
                    attributes: ['firstName', 'lastName', 'roleId', 'id']
                }]
            }],
        })
        if (doctor.length === 0) {
            return { text: "Không tìm thấy thông tin bác sĩ phù hợp. Bạn có thể cung cấp thêm thông tin cụ thể bác sĩ cần tìm hoặc nhắn tin với tiếp nhận để có câu trả lời cụ thể nhất!", link: [] };
        }
        let link = doctor.flatMap(specialty =>
            specialty?.staffSpecialtyData?.map(staff => ({
                name: `${staff?.position}. ${staff.staffUserData.lastName} ${staff.staffUserData.firstName} - ${specialty.name}`,
                url: `/doctor-detail/${staff.staffUserData.id}`
            }))
        );
        return {
            text: doctor,
            link: link
        }
    } catch (error) {
        console.log('Error:', error);
        return {
            text: "Không tìm thấy thông tin bác sĩ phù hợp",
            link: null
        };
    }
}

const findInformationDoctorExactly = async (param) => {
    try {
        let findOne = await db.User.findAll({
            where: {
                [Op.and]: [
                    { roleId: ROLE.DOCTOR },
                    { status: status.ACTIVE },
                    {
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${param}%` } },
                            { lastName: { [Op.like]: `%${param}%` } },
                            Sequelize.literal(`CONCAT(lastName, ' ', firstName) LIKE '%${param}%'`)
                        ]
                    }
                ]
            },
            include: [{
                model: db.Staff,
                as: 'staffUserData',
                attributes: ['id', 'price', 'position', 'departmentId', 'shortDescription'],
                include: [{
                    model: db.Department,
                    as: 'staffDepartmentData',
                    attributes: ['id', 'name'],
                    required: false,
                }]
            }],
            nest: true
        })
        if (!findOne) {
            return { text: "Không tìm thấy thông tin bác sĩ phù hợp. Bạn có thể cung cấp thêm thông tin cụ thể bác sĩ cần tìm hoặc nhắn tin với tiếp nhận để có câu trả lời cụ thể nhất!", link: [] };
        }
        let link = findOne.map(doctor => ({
            name: `Chi tiết bác sĩ ${doctor.lastName} ${doctor.firstName}`,
            url: `/doctor-detail/${doctor.id}`
        }))
        return {
            text: `-Đây là thông tin bác sĩ mà bạn tìm kiếm, bạn có thể đặt lịch với bác sĩ bằng cách nhắn vào xem chi tiết bác sĩ
            -Thông tin từ database: ${findOne}`,
            link: link
        }



    } catch (error) {
        console.log('Error:', error);
        return { text: "Bạn có thể tham khảo thông tin nhân sự tại bệnh viện Hoa Sen tại đây", link: [{ name: "Danh sách bác sĩ của Hoa Sen", url: "/doctor-list" }] };
    }
}