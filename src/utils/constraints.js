const status = {
    DONE: 7, // đã khám xong
    EXAMINING: 6, // đang khám
    PAID: 5, // đã thanh toán chờ để khám
    WAITING: 4, // chờ thanh toán
    REJECT: 3, // không duyệt
    PENDING: 2, // chờ duyệt << sẽ để thêm ở exam để nhân viên tiếp nhận lấy ra --> nhân viên tiếp nhận ok thì chuyển lên 4
    ACTIVE: 1,
    INACTIVE: 0
}
const typeRoom = {
    CLINIC: 2,
    DUTY: 1,
}
const department = {
    CLINIC: 2,
}
const pamentStatus = {
    UNPAID: 0,
    PENDING: 1,
    PAID: 2
}

const PAGINATE = [
    {
        id: 1,
        value: 10
    },
    {
        id: 2,
        value: 25
    },
    {
        id: 3,
        value: 50
    },
    {
        id: 4,
        value: 100
    }
]

const ROLE = {
    ADMIN: 1,
    PATIENT: 2,
    DOCTOR: 3,
    NURSE: 4,
    PHARMACIST: 5,
    RECEPTIONIST: 6,
    ACCOUNTANT: 7,
}
const COOKIE = {
    refreshToken: "refreshToken"
}
const TIME = {
    tokenLife: 60 * 60, // tính theo giây
    refreshToken: 7 * 24 * 60 * 60, // tính theo giây
    cookieLife: 7 * 24 * 60 * 60 * 1000,// tính theo milisecond
    tokenEmail: 3 * 60, // tính theo giây
}
const PAYMENT_METHOD = {
    MOMO: 1,
    VN_PAY: 2,
    CASH: 3
}
const TYPE_PAYMENT = {
    EXAMINATION: 1,
    PARA_CLINICAL: 2,
    MEDICINE: 3,
    APPOINMENT: 4
}
module.exports = {
    status,
    typeRoom,
    department,
    pamentStatus,
    PAGINATE,
    ROLE,
    COOKIE,
    TIME,
    PAYMENT_METHOD,
    TYPE_PAYMENT
}