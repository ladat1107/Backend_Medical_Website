export const removeVietnameseTones = (str) => {
    return str
        .toLowerCase() // Chuyển về chữ thường
        .normalize("NFD") // Chuẩn hóa thành dạng decomposed (tách dấu)
        .replace(/[\u0300-\u036f]/g, "") // Xóa dấu thanh
        .replace(/đ/g, "d").replace(/Đ/g, "D") // Thay thế 'đ' và 'Đ'
        .replace(/[^a-zA-Z0-9\s]/g, "") // Loại bỏ ký tự đặc biệt (giữ số, chữ, khoảng trắng)
        .trim() // Xóa khoảng trắng đầu cuối
        .replace(/\s+/g, " ") // Xóa khoảng trắng thừa ; 
}
