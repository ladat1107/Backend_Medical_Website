import { ERROR_SERVER } from "../../../dist/utils/constraints"

export const getServiceHome = (req, res) => {
    try {
        let data = [
            {
                "isCashBack": true,
                "contentCashBack": "Đặt khám liền tay - nhận ngay ưu đãi hoàn tiền lên đến 5%! 💥",
                "message": "",
                "disabled": false,
                "children": [],
                "description": "Đặt khám nhanh chóng, tiết kiệm thời gian, an toàn tiện lợi",
                "banner": "https://cdn.medpro.vn/prod-partner/d53ed2b9-dcae-4509-90be-8ecd11cdc628-dat-kham-co-so.webp",
                "slug": "dat-kham-tai-co-so",
                "position": "IN",
                "name": "Đặt khám tại cơ sở",
                "image": "https://cdn.medpro.vn/prod-partner/94fad041-984a-4ed7-99e8-3a940360a1cc-7751fd3f-f46c-436a-af19-2c64d4d5cf25-dkcs.webp",
                "priority": 1,
                "status": true,
                "createdAt": "2020-06-15T05:37:08.837Z",
                "updatedAt": "2024-11-12T01:38:40.279Z",
                "type": "booking.date",
                "customUrl": "",
                "displayIcon": "https://prod-partner.s3-hcm-r1.longvan.net/ba823a61-7952-4914-85c6-b1375c47a6ba-dkcs.png",
                "mobileIcon": "https://cdn.medpro.vn/prod-partner/a656f6fe-c9d4-4cc6-b5c9-1c5ee663d1f9-ba823a61-7952-4914-85c6-b1375c47a6ba-dkcs.png",
                "mobileRoute": "1",
                "webRoute": "1",
                "workFlow": "BOOKING",
                "screenOptions": {
                    "headerTitle": ""
                },
                "csChatConfig": null,
                "nextPartner": true,
                "id": "5ee7090454419e0019192012"
            },
            {
                "isCashBack": true,
                "contentCashBack": "Đặt khám liền tay - nhận ngay ưu đãi hoàn tiền lên đến 5%! 💥",
                "message": "",
                "disabled": false,
                "children": [],
                "description": "Chủ động chọn bác sĩ mà bạn tin tưởng, an tâm khám bệnh",
                "banner": "https://cdn.medpro.vn/prod-partner/9a085fa0-374e-4aca-9ffe-6e6d2c5c03e7-dat-kham-theo-bac-si.webp",
                "slug": "dat-kham-theo-bac-si",
                "position": "IN",
                "name": "Đặt khám theo bác sĩ",
                "image": "https://prod-partner.s3-hcm-r1.longvan.net/488715df-05ff-42ef-bf6b-27d91d132158-bacsi.png",
                "priority": 2,
                "status": true,
                "createdAt": "2020-06-15T05:37:08.837Z",
                "updatedAt": "2024-10-28T02:58:30.361Z",
                "type": "booking.doctor",
                "customUrl": "",
                "displayIcon": "https://prod-partner.s3-hcm-r1.longvan.net/95d6dd1a-a89b-4bf8-9d26-ff6b9acc5317-bacsi.png",
                "mobileIcon": "https://prod-partner.s3-hcm-r1.longvan.net/0da7fa6f-8ce1-4c23-95fb-d2f633b2ae7a-bacsi.png",
                "mobileRoute": "1",
                "webRoute": "1",
                "workFlow": "BOOKING",
                "csChatConfig": null,
                "screenOptions": {
                    "headerTitle": ""
                },
                "nextPartner": true,
                "id": "60c0928f37a2392830001af3"
            },
            {
                "isCashBack": false,
                "contentCashBack": "",
                "message": "",
                "disabled": false,
                "children": [],
                "description": "Chăm sóc sức khoẻ từ xa kết nối với Bác sĩ qua cuộc gọi Video và Nhắn Tin mọi lúc mọi nơi",
                "banner": "https://cdn.medpro.vn/prod-partner/5249549a-4d7c-4be8-95a7-ed7569d6bc59-tu-van-kham-benh-qua-video.webp",
                "slug": "tu-van-kham-benh-tu-xa",
                "position": "IN",
                "name": "Tư vấn khám bệnh qua video",
                "type": "booking.telemed",
                "priority": 3,
                "customUrl": "",
                "image": "https://prod-partner.s3-hcm-r1.longvan.net/9fdd77eb-9baa-4f3b-a108-d91e136a0bf9-tele.png",
                "mobileIcon": "https://prod-partner.s3-hcm-r1.longvan.net/d6e8f30b-09e2-42c4-a610-c5580e4b0238-tele.png",
                "displayIcon": "https://prod-partner.s3-hcm-r1.longvan.net/bc4f36f0-c1aa-491c-854e-04ef3ace1c36-tele.png",
                "status": true,
                "mobileStatus": false,
                "screenOptions": {
                    "headerTitle": ""
                },
                "createdAt": "2023-07-13T10:10:48.101Z",
                "updatedAt": "2024-10-21T05:09:57.716Z",
                "workFlow": "BOOKING",
                "csChatConfig": {
                    "domain": "PKH_TUVAN_KHAMBENH_TUXA",
                    "domainId": 9549
                },
                "nextPartner": true,
                "id": "64afcda8448150fc6562bb5b"
            },
            {
                "isCashBack": true,
                "contentCashBack": "Đặt khám liền tay - nhận ngay ưu đãi hoàn tiền lên đến 5%! 💥",
                "message": "",
                "disabled": false,
                "children": [],
                "description": "Lựa chọn linh hoạt, tiện lợi: Xét nghiệm y tế tại cơ sở và tại nhà bạn, đảm bảo kết quả chính xác",
                "banner": "https://cdn.medpro.vn/prod-partner/7b36c2a1-513f-43e0-b35f-1e3ade5e72ac-dat-lich-xet-nghiem.webp",
                "slug": "dat-lich-xet-nghiem",
                "position": "IN",
                "type": "booking.covid",
                "name": "Đặt lịch xét nghiệm",
                "image": "https://cdn.medpro.vn/prod-partner/c193937f-8c0f-479e-be31-5610db6f7df1-dat-lich-xet-nghiem.png",
                "priority": 4,
                "status": true,
                "mobileStatus": false,
                "createdAt": "2021-07-08T04:10:53.067Z",
                "updatedAt": "2024-08-16T07:20:02.365Z",
                "mobileRoute": "1",
                "webRoute": "1",
                "displayIcon": "https://cdn.medpro.vn/prod-partner/298073be-5fbd-49b8-91ab-8400804609cc-dat-lich-xet-nghiem.png",
                "mobileIcon": "https://cdn.medpro.vn/prod-partner/84a8d457-2036-404c-9fc2-beb4f9e37cbd-dat-lich-xet-nghiem.png",
                "workFlow": "BOOKING",
                "screenOptions": {
                    "headerTitle": ""
                },
                "csChatConfig": {
                    "domain": "PKH_TUVAN_XETNGHIEM",
                    "domainId": 9550
                },
                "nextPartner": true,
                "id": "60ea6cd637a2390220004e63"
            },
            {
                "isCashBack": true,
                "contentCashBack": "Đặt khám liền tay - nhận ngay ưu đãi hoàn tiền lên đến 5%! 💥",
                "message": "",
                "disabled": false,
                "children": [],
                "description": "Khám sức khỏe toàn diện, từ cơ bản đến chuyên sâu với gói dịch vụ đa dạng tại Medpro",
                "banner": "https://cdn.medpro.vn/prod-partner/75c4c8e1-7fd3-492a-afc1-49926e9c7458-goi-kham-suc-khoe.webp",
                "slug": "goi-kham-suc-khoe",
                "position": "IN",
                "name": "Gói khám sức khỏe",
                "type": "booking.package",
                "priority": 4,
                "image": "https://prod-partner.s3-hcm-r1.longvan.net/b4181f19-f965-40b8-a4c5-2996cb960104-goi_kham.png",
                "webRoute": "1",
                "mobileRoute": "1",
                "status": true,
                "mobileStatus": false,
                "mobileIcon": "https://prod-partner.s3-hcm-r1.longvan.net/2aa9d1ad-b589-4528-b933-14b94c7888c5-goi_kham.png",
                "createdAt": "2022-03-07T03:18:27.960Z",
                "updatedAt": "2024-10-28T02:59:11.619Z",
                "customUrl": "",
                "displayIcon": "https://prod-partner.s3-hcm-r1.longvan.net/e0973784-9b40-421c-a7da-35a46c252769-goi_kham.png",
                "workFlow": "BOOKING",
                "csChatConfig": {
                    "domain": "PKH_TUVAN_GOIKHAM",
                    "domainId": 9548
                },
                "screenOptions": {
                    "headerTitle": ""
                },
                "nextPartner": true,
                "id": "62257983429a6e0019fcf824"
            },
            {
                "isCashBack": true,
                "contentCashBack": "Đặt khám liền tay - nhận ngay ưu đãi hoàn tiền lên đến 5%! 💥",
                "message": "",
                "disabled": false,
                "children": [],
                "description": "Hẹn lịch tiêm chủng dễ dàng với các cơ sở uy tín hàng đầu",
                "banner": "https://cdn.medpro.vn/prod-partner/46b37410-c3f1-494e-a7c4-9f74db2a6eec-dat-lich-tiem-chung.webp",
                "slug": "dat-lich-tiem-chung",
                "position": "IN",
                "name": "Đặt lịch tiêm chủng",
                "type": "booking.vaccine",
                "priority": 4,
                "image": "https://cdn-pkh.longvan.net/prod-partner/f141b109-2daa-4953-ad55-5a395f900d46-tiaaam_chaaang.png",
                "webRoute": "1",
                "mobileRoute": "1",
                "status": true,
                "mobileStatus": true,
                "mobileIcon": "https://cdn-pkh.longvan.net/prod-partner/47449a2e-8418-451a-bdbd-8b22fadc7201-tiaaam_chaaang.png",
                "createdAt": "2022-06-08T09:32:45.052Z",
                "updatedAt": "2024-11-07T03:54:14.991Z",
                "displayIcon": "https://cdn-pkh.longvan.net/prod-partner/21ac9bb2-2c06-4448-a97d-e94073a4380a-tiaaam_chaaang.png",
                "screenOptions": {
                    "headerTitle": ""
                },
                "csChatConfig": {
                    "domain": "PKH_PKH_TUVAN_TIEMCHUNG",
                    "domainId": 9555
                },
                "workFlow": "BOOKING",
                "nextPartner": true,
                "id": "62a06cbd23d38e00215955bb"
            },
            {
                "isCashBack": true,
                "contentCashBack": "Đặt khám liền tay - nhận ngay ưu đãi hoàn tiền lên đến 5%! 💥",
                "message": "Tính năng đang được phát triển",
                "disabled": false,
                "children": [],
                "description": "Chăm sóc sức khỏe chuyên nghiệp ngay tại nhà",
                "banner": "https://cdn.medpro.vn/prod-partner/fb51bd32-6d14-4f80-ad60-8a31c9f0e063-y-te-tai-nha.webp",
                "slug": "y-te-tai-nha",
                "position": "IN",
                "name": "Y tế tại nhà",
                "type": "booking.homecare",
                "priority": 5,
                "image": "https://cdn-pkh.longvan.net/prod-partner/fa0b00be-d554-404a-bf9a-4a5f216ee978-chaam_saac_taaoa_i_nhaa.png",
                "mobileIcon": "https://cdn-pkh.longvan.net/prod-partner/a9f6c777-5cfc-4446-bcee-4cf83c753e42-chaam_saac_taaoa_i_nhaa.png",
                "displayIcon": "https://cdn-pkh.longvan.net/prod-partner/75218ffc-d8a7-4118-8836-41da9f7766ab-chaam_saac_taaoa_i_nhaa.png",
                "status": true,
                "mobileStatus": false,
                "createdAt": "2023-05-12T02:59:33.220Z",
                "updatedAt": "2024-08-09T02:24:56.322Z",
                "workFlow": "BOOKING",
                "screenOptions": {
                    "headerTitle": ""
                },
                "csChatConfig": {
                    "domain": "PKH_TUVAN_YTETAINHA",
                    "domainId": 9551
                },
                "nextPartner": true,
                "id": "645dab956aa90c0975597905"
            },
            {
                "isCashBack": false,
                "contentCashBack": "",
                "message": "",
                "disabled": false,
                "children": [],
                "description": "Tiện lợi và an toàn, tránh những rủi ro thất thoát khi đến bệnh viện",
                "banner": "https://cdn.medpro.vn/prod-partner/82178030-8044-40a3-9006-57f6b8ffc807-thanh-toan-vien-phi.webp",
                "slug": "thanh-toan-vien-phi",
                "position": "IN",
                "type": "payment.fee",
                "name": "Thanh toán Viện phí",
                "image": "https://prod-partner.s3-hcm-r1.longvan.net/0640985d-4280-4e8c-8ec6-939f9a4cf44b-thanhtoanvp.png",
                "priority": 6,
                "status": true,
                "createdAt": "2020-08-21T05:42:56.812Z",
                "updatedAt": "2024-10-21T05:09:57.715Z",
                "displayIcon": "https://prod-partner.s3-hcm-r1.longvan.net/5330642b-2ef0-41ea-a77f-9eb3ceb1eb63-thanhtoanvp.png",
                "mobileIcon": "https://prod-partner.s3-hcm-r1.longvan.net/53932d80-741e-4e5c-9d83-fb006180d82f-thanhtoanvp.png",
                "workFlow": "PAYMENT_FEE",
                "screenOptions": {
                    "headerTitle": ""
                },
                "csChatConfig": null,
                "nextPartner": true,
                "id": "5f3f5ee0ada9a0001aeac9f8"
            }
        ]
        let customData = []
        data.forEach(item => {
            let obj = {
                name: item.name,
                image: item.image,
                link: item.customUrl || null,
                id: item.id
            }
            customData.push(obj)
        })
        return res.status(200).json({
            EC: 0,
            EM: "Lấy dịch vụ thành công",
            DT: customData
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(ERROR_SERVER);
    }
}
