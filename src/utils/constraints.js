export const status = {
    DONE_INPATIENT: 8, // Dành cho việc hoàn thành thu thêm/trả lại tiền tạm ứng cho bệnh nhân nội trú
    DONE: 7, // đã khám xong
    EXAMINING: 6, // đang khám
    PAID: 5, // đã thanh toán chờ để khám
    WAITING: 4, // chờ thanh toán
    REJECT: 3, // không duyệt của handbook
    PENDING: 2, // chờ duyệt << sẽ để thêm ở exam để nhân viên tiếp nhận lấy ra --> nhân viên tiếp nhận ok thì chuyển lên 4
    ACTIVE: 1,
    INACTIVE: 0
}
export const paymentStatus = {
    UNPAID: 0,
    PENDING: 1,
    PAID: 2,
    DISCHARGE_PAID: 3, // Đã trả cho đơn thuốc nội trú MANG VỀ 
    REFUNDED: 4, // Hoàn tiền
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
    APPOINMENT: 4,
    ADVANCE: 5,
    DISCHARGE: 6
}
export const SOCKET = {
    EMIT_UPDATE_TICKET_NEW_DAY: "updateTicketNewDay"
}
export const ERROR_SERVER = {
    EC: 500,
    EM: "Lỗi hệ thống",
    DT: null
}

export const STATUS_MESSAGE = {
    FAILED: "failed",
    SENDING: "sending",
    SENT: "sent",
    RECEIVED: "received",
    READ: "read"
}
export const MEDICAL_TREATMENT_TIER = {
    INPATIENT: 1,
    OUTPATIENT: 2,
    EMERGENCY: 3
}
