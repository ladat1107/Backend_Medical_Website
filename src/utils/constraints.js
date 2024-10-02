const status = {
    REJECT: 3, // không duyệt
    PENDING: 2, // chờ duyệt
    ACTIVE: 1,
    INACTIVE: 0
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
module.exports = {
    status,
    pamentStatus,
    PAGINATE
}