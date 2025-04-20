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

export const splitName = (name) => {
    const nameArray = name?.split(" ");
    if (nameArray?.length === 1) return {
        lastName: nameArray[0],
        firstName: ""
    }
    return {
        lastName: nameArray.pop(),
        firstName: nameArray.join(" ")
    }
}

export const decodeHexToString = (hex) => {
    try {
        // 1. Xóa khoảng trắng và ký tự không hợp lệ
        const cleanedHex = hex.trim().replace(/[^a-fA-F0-9]/g, '');

        // 2. Tạo một mảng byte từ chuỗi hex
        const byteArray = [];
        for (let i = 0; i < cleanedHex.length; i += 2) {
            const byte = cleanedHex.substr(i, 2);
            byteArray.push(parseInt(byte, 16));
        }

        // 3. Dùng TextDecoder để decode mảng byte theo UTF-8
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(new Uint8Array(byteArray));
    } catch (error) {
        console.log(error);
        return "";
    }
}

export const formatDobQR = (dob) => {
    try {
        const day = dob.slice(0, 2);
        const month = dob.slice(2, 4);
        const year = dob.slice(4, 8);
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.log(error);
        return "";
    }
}

