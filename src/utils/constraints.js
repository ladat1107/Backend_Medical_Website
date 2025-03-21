export const status = {
    DONE: 7, // đã khám xong
    EXAMINING: 6, // đang khám
    PAID: 5, // đã thanh toán chờ để khám
    WAITING: 4, // chờ thanh toán
    REJECT: 3, // không duyệt
    PENDING: 2, // chờ duyệt << sẽ để thêm ở exam để nhân viên tiếp nhận lấy ra --> nhân viên tiếp nhận ok thì chuyển lên 4
    ACTIVE: 1,
    INACTIVE: 0
}
export const paymentStatus = {
    UNPAID: 0,
    PENDING: 1,
    PAID: 2
}

export const typeRoom = {
    CLINIC: 2,
    DUTY: 1,
}
export const department = {
    CLINIC: 2,
}

export const ROLE = {
    ADMIN: 1,
    PATIENT: 2,
    DOCTOR: 3,
    NURSE: 4,
    PHARMACIST: 5,
    RECEPTIONIST: 6,
    ACCOUNTANT: 7,
}
export const COOKIE = {
    refreshToken: "refreshToken"
}
export const TIME = {
    tokenLife: 60 * 60, // tính theo giây
    refreshToken: 7 * 24 * 60 * 60, // tính theo giây
    cookieLife: 7 * 24 * 60 * 60 * 1000,// tính theo milisecond
    tokenEmail: 3 * 60, // tính theo giây
}
export const PAYMENT_METHOD = {
    MOMO: 1,
    VN_PAY: 2,
    CASH: 3
}
export const TYPE_PAYMENT = {
    EXAMINATION: 1,
    PARA_CLINICAL: 2,
    PRESCRIPTION: 3,
    APPOINMENT: 4
}
export const SOCKET = {
    EMIT_UPDATE_TICKET_NEW_DAY: "updateTicketNewDay"
}
export const ERROR_SERVER = {
    EC: 500,
    EM: "Lỗi hệ thống",
    DT: null
}

export const MESSAGE_TYPE = {
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
        array: [`khoa ([\\w\\s]+) tri benh gi`, "khoa ([\\w\\s]+) tri benh", 'khoa ([\\w\\s]+) chua benh nao']
    },
    COUNT_DOCTORS_IN_DEPARTMENT: {
        type: "COUNT_DOCTORS_IN_DEPARTMENT",
        array: ["/khoa\s+([\w\s]+?)\s+(co\s+)?(bao nhieu|may|nhiu|nheu|nhieu)\s+(bac si|bs)/i"]
    },
    DOCTORS_TREAT_DISEASE: {
        type: "DOCTORS_TREAT_DISEASE",
        array: ["ai tri benh ([\\w\\s]+)", "ai chua benh ([\\w\\s]+)", "ai dieu tri benh ([\\w\\s]+)", "ai kham benh ([\\w\\s]+)", "ai kham ([\\w\\s]+)",
            'bac si nao tri benh ([\\w\\s]+)', 'bac si nao chua benh ([\\w\\s]+)', 'bac si nao dieu tri benh ([\\w\\s]+)',
            'bs nao chua benh ([\\w\\s]+)', 'bs nao tri benh ([\\w\\s]+)', 'bs nao dieu tri benh ([\\w\\s]+)']
    },
    UNKNOWN: "UNKNOWN"
}