export const STORES = [
  {
    id: 'dong-khoi',
    name: 'Lush Vincom Đồng Khởi',
    region: 'HCM',
    hours: { weekday: '10h - 22h', weekend: '9h30 - 22h' },
    shifts: {
      weekday: { morning: '9h - 17h30', middle: '12h - 20h30', afternoon: '13h30 - 22h', handover: '13h30 - 17h30 (4 tiếng)' },
      weekend: { morning: '8h30 - 17h', middle: '12h - 20h30', afternoon: '13h30 - 22h', handover: '13h30 - 17h (3.5 tiếng)' }
    },
    lunchSchedule: {
      morning: ['12h - 12h30: 1 nhân sự ca sáng', '12h30 - 13h: 1 nhân sự ca sáng'],
      middle: ['13h30 - 14h: 1 nhân sự ca giữa'],
      afternoon: ['15h - 15h30: 1 nhân sự ca tối', '15h30 - 16h: 1 nhân sự ca tối', '16h30 - 17h: 1 nhân sự ca tối']
    }
  },
  {
    id: 'saigon-center',
    name: 'Lush Saigon Center',
    region: 'HCM',
    hours: { weekday: '9h30 - 21h30', weekend: '9h30 - 22h' },
    shifts: {
      weekday: { morning: '8h30 - 17h', middle: '12h - 20h30', afternoon: '13h - 21h30', handover: '13h - 17h (4 tiếng)' },
      weekend: { morning: '8h30 - 17h', middle: '12h - 20h30', afternoon: '13h30 - 22h', handover: '13h30 - 17h (3.5 tiếng)' }
    },
    lunchSchedule: {
      morning: ['12h - 12h30: 1 nhân sự ca sáng', '12h30 - 13h: 1 nhân sự ca sáng'],
      middle: ['13h30 - 14h: 1 nhân sự ca giữa'],
      afternoon: ['15h - 15h30: 1 nhân sự ca tối', '15h30 - 16h: 1 nhân sự ca tối']
    }
  },
  {
    id: 'hung-vuong',
    name: 'Lush Hùng Vương Plaza',
    region: 'HCM',
    hours: { weekday: '9h30 - 22h', weekend: '9h30 - 22h' },
    shifts: {
      weekday: { morning: '8h30 - 17h', middle: '12h - 20h30', afternoon: '13h30 - 22h', handover: '13h30 - 17h30 (4 tiếng)' },
      weekend: { morning: '8h30 - 17h', middle: '12h - 20h30', afternoon: '13h30 - 22h', handover: '13h30 - 17h (3.5 tiếng)' }
    },
    lunchSchedule: {
      morning: ['12h - 12h30: 1 nhân sự ca sáng', '12h30 - 13h: 1 nhân sự ca sáng'],
      middle: ['13h30 - 14h: 1 nhân sự ca giữa'],
      afternoon: ['15h - 15h30: 1 nhân sự ca tối', '15h30 - 16h: 1 nhân sự ca tối']
    }
  },
  {
    id: 'lotte-tay-ho',
    name: 'Lush Lotte Tây Hồ',
    region: 'HN',
    hours: { weekday: '9h30 - 22h', weekend: '9h30 - 22h' },
    shifts: {
      weekday: { morning: '8h30 - 17h', middle: '12h - 20h30', afternoon: '13h30 - 22h', handover: '13h30 - 17h30 (4 tiếng)' },
      weekend: { morning: '8h30 - 17h', middle: '12h - 20h30', afternoon: '13h30 - 22h', handover: '13h30 - 17h (3.5 tiếng)' }
    },
    lunchSchedule: {
      morning: ['12h - 12h30: 1 nhân sự ca sáng', '12h30 - 13h: 1 nhân sự ca sáng'],
      middle: ['13h30 - 14h: 1 nhân sự ca giữa'],
      afternoon: ['15h - 15h30: 1 nhân sự ca tối', '15h30 - 16h: 1 nhân sự ca tối']
    }
  },
  {
    id: 'aeon-ha-dong',
    name: 'Lush Aeon Mall Hà Đông',
    region: 'HN',
    hours: { weekday: '10h - 22h', weekend: '9h - 22h' },
    shifts: {
      weekday: { morning: '9h - 17h30', middle: '12h - 20h30', afternoon: '13h30 - 22h', handover: '13h30 - 17h30 (4 tiếng)' },
      weekend: { morning: '8h - 16h30', middle: '12h - 20h30', afternoon: '13h30 - 22h', handover: '13h30 - 16h30 (3 tiếng)' }
    },
    lunchSchedule: {
      morning: ['12h - 12h30: 1 nhân sự ca sáng', '12h30 - 13h: 1 nhân sự ca sáng'],
      middle: ['13h30 - 14h: 1 nhân sự ca giữa'],
      afternoon: ['15h - 15h30: 1 nhân sự ca tối', '15h30 - 16h: 1 nhân sự ca tối']
    }
  },
  {
    id: 'hanoi-center',
    name: 'Lush Hanoi Center',
    region: 'HN',
    hours: { weekday: '9h30 - 21h30', weekend: '9h30 - 22h' },
    shifts: {
      weekday: { morning: '8h30 - 17h', middle: '12h - 20h30', afternoon: '13h - 21h30', handover: '13h - 17h (4 tiếng)' },
      weekend: { morning: '8h30 - 17h', middle: '12h - 20h30', afternoon: '13h30 - 22h', handover: '13h30 - 17h (3.5 tiếng)' }
    },
    lunchSchedule: {
      morning: ['12h - 12h30: 1 nhân sự ca sáng', '12h30 - 13h: 1 nhân sự ca sáng'],
      middle: ['13h30 - 14h: 1 nhân sự ca giữa'],
      afternoon: ['15h - 15h30: 1 nhân sự ca tối', '15h30 - 16h: 1 nhân sự ca tối']
    }
  }
];

export const SHIFT_NOTES = [
  'Nhân viên ca sáng vô sớm hơn giờ hoạt động cửa hàng 1 tiếng để dọn dẹp vệ sinh và chuẩn bị mở cửa.',
  'Ca chiều hoàn tất đi ăn trước 17h và cả 2 ca có bấm vân tay khi đi ăn.',
  'Giờ làm việc không bao gồm giờ trang điểm và ăn sáng. Nếu có thì đi sớm hơn giờ làm việc 30 phút để thực hiện.'
];

export const SHELF_DIVISION = [
  { id: 1, area: 'Shower', defaultStaff: '' },
  { id: 2, area: 'Hair', defaultStaff: '' },
  { id: 3, area: 'Fragrance + Gift', defaultStaff: '' },
  { id: 4, area: 'Face', defaultStaff: '' },
  { id: 5, area: 'Hand/Body', defaultStaff: '' },
  { id: 6, area: 'Last pick up/Cashier', defaultStaff: '' }
];

export const POSITION_DIVISION = [
  { id: 1, position: 'Tester', defaultStaff: '' },
  { id: 2, position: 'Kho', defaultStaff: '' },
  { id: 3, position: 'VMD', defaultStaff: '' },
  { id: 4, position: 'Vệ sinh CH', defaultStaff: '' }
];

export const POSITION_SOP = {
  kho: {
    title: 'Vị trí Kho',
    sections: [
      {
        time: 'Trước/trong giờ hoạt động',
        tasks: [
          {
            name: 'Kiểm tra vệ sinh kho',
            purpose: 'Đảm bảo kho sạch sẽ. Hàng bán/tặng/tester/dụng cụ được để đúng layout và quy định PCCC.',
            steps: [
              'Dụng cụ để đúng quy định',
              'Hàng hóa để đúng khu vực theo sơ đồ kho',
              'VM props và tester để đúng nơi quy định',
              'Những vật dụng dễ cháy cần phải thu dọn luôn'
            ]
          },
          {
            name: 'Sắp xếp lại hàng hóa',
            purpose: 'Đảm bảo hàng hóa được để đúng vị trí, sắp xếp logic, dễ tìm dễ lấy và kiểm tra.',
            steps: [
              'Kho phải luôn luôn có sơ đồ kho',
              'Các thùng hàng không sử dụng phải được niêm phong và có chữ ký của leaders',
              'Mỗi tháng những hàng VMD không sử dụng thì không giữ lại để tránh chật kho. Danh sách hàng VM cần được remove cần được advise từ VM'
            ]
          },
          {
            name: 'Kiểm tra tình trạng kho',
            purpose: 'Đảm bảo đủ chỗ để cất hàng.',
            steps: [
              'Kiểm tra số lượng hàng hóa backup, tester trả vỏ, hàng return',
              'Nếu thấy tồn kho quá nhiều và chiếm nhiều diện tích => Đề xuất với leaders để chuyển về kho tổng/kho bớt'
            ]
          }
        ]
      },
      {
        time: 'Sau giờ hoạt động',
        tasks: [
          {
            name: 'Vệ sinh kho',
            purpose: 'Đảm bảo vệ sinh kho trước khi ra về.',
            steps: ['Lau dọn kệ kho, dọn dẹp các thùng các-tông trống phát sinh']
          },
          {
            name: 'Sắp xếp gọn gàng',
            purpose: 'Đảm bảo kho ngăn nắp cho ngày hôm sau.',
            steps: ['Bỏ rác phát sinh và vệ sinh tủ lạnh kho trước khi về']
          },
          {
            name: 'Đóng cửa kho',
            purpose: 'Đảm bảo an toàn điện và tài sản.',
            steps: ['Kiểm tra tất cả các thiết bị điện và đóng cửa kho trước khi ra về']
          }
        ]
      }
    ]
  },
  vmd: {
    title: 'Vị trí VMD (Visual Merchandising)',
    sections: [
      {
        time: 'Trước/trong giờ hoạt động',
        tasks: [
          {
            name: 'Kiểm tra theo guideline từ VM/Ops',
            purpose: 'Cập nhật đúng và chính xác nhất các tiêu chuẩn trưng bày.',
            steps: [
              'Cập nhật các guidelines mới từ bộ phận VM & Retail',
              'Note lại các khu vực cần thay đổi và ghi chú các deadline hoàn thành công việc'
            ]
          },
          {
            name: 'Thực hiện VMD',
            purpose: 'Trưng bày theo đúng hướng dẫn (guidelines) của thương hiệu.',
            steps: [
              'Chuẩn bị hàng hóa và các routine cần thiết theo Category',
              'Chuẩn bị dụng cụ trưng bày và các bảng biển (POP) nếu cần',
              'Trưng bày chi tiết trên kệ, bàn trung tâm và sub tables',
              'Kiểm tra màn hình TV/Video phát tại cửa hàng',
              'Gửi hình ảnh báo cáo về cho bộ phận VMD + Brand mỗi ngày'
            ]
          },
          {
            name: 'Quản lý các vật dụng VMD',
            purpose: 'Sắp xếp và quản lý dụng cụ VM ngăn nắp, đúng số lượng.',
            steps: [
              'Dụng cụ VMD đang hoặc thường xuyên sử dụng',
              'Dụng cụ VMD đã trưng bày của tháng trước (cất gọn)',
              'Các vật dụng khác như: Signage, Bút vẽ, VM Props'
            ]
          },
          {
            name: 'Công việc khác',
            purpose: 'Đảm bảo hiệu quả hoạt động chung của cửa hàng.',
            steps: [
              'Hỗ trợ vệ sinh cửa hàng, tester và các sản phẩm',
              'Tham gia bán hàng khi đông khách',
              'Kiểm tra VMD thường xuyên và nhắc nhở nhân viên refill hàng/trưng bày lại đúng chuẩn'
            ]
          }
        ]
      }
    ]
  },
  vesinh: {
    title: 'Vị trí Vệ sinh Cửa hàng',
    sections: [
      {
        time: 'Trước/trong/sau giờ hoạt động',
        tasks: [
          {
            name: 'Kiểm tra sàn cửa hàng',
            purpose: 'Đảm bảo cửa hàng sạch sẽ, an toàn, không trơn trượt.',
            steps: [
              'Quét và lau sàn bằng dung dịch vệ sinh phù hợp',
              'Lau ngay khi có nước hoặc xà phòng rơi vãi trên sàn',
              'Kiểm tra các góc khuất và chân kệ trưng bày'
            ]
          },
          {
            name: 'Kiểm tra quầy thanh toán & tester',
            purpose: 'Đảm bảo trải nghiệm khách hàng sạch sẽ, chuyên nghiệp.',
            steps: [
              'Lau bề mặt quầy thu ngân, khay thối tiền, máy POS và máy in bill',
              'Nhắc nhở nhân viên phụ trách kệ vệ sinh lại các tester của khu vực mình',
              'Đề xuất với leader order thêm dung dịch vệ sinh hàng tháng'
            ]
          },
          {
            name: 'Vệ sinh kệ trưng bày & gương kính',
            purpose: 'Giữ hình ảnh thương hiệu luôn chỉn chu, sáng bóng.',
            steps: [
              'Lau sạch bụi bẩn trên kệ, bảng giá (POP) và các vật dụng trang trí',
              'Lau kính cửa ra vào, vách kính và gương soi, không để vệt nước',
              'Lưu ý: Không làm xê dịch layout trưng bày (báo VMD nếu cần di chuyển)'
            ]
          },
          {
            name: 'Vệ sinh kho & thùng rác',
            purpose: 'Đảm bảo vệ sinh chung và tránh mùi hôi.',
            steps: [
              'Đổ rác định kỳ nhiều lần trong ngày khi đầy',
              'Phân loại rác đúng quy định, thay túi rác mới sạch sẽ',
              'Lau chùi khu vực xung quanh thùng rác cửa hàng'
            ]
          },
          {
            name: 'Kiểm tra & bổ sung dụng cụ vệ sinh',
            purpose: 'Đảm bảo đủ dụng cụ cho hoạt động hằng ngày.',
            steps: [
              'Kiểm tra nước lau sàn, khăn lau, cây lau sàn và chổi quét',
              'Báo cáo Leader/Store Manager khi gần hết vật tư tiêu hao',
              'Sắp xếp dụng cụ vệ sinh đúng khu vực quy định sau khi dùng'
            ]
          },
          {
            name: 'Tổng vệ sinh cuối ngày',
            purpose: 'Đảm bảo cửa hàng sẵn sàng đón khách cho ngày hôm sau.',
            steps: [
              'Lau toàn bộ sàn cửa hàng lần cuối trước khi đóng cửa',
              'Kiểm tra các góc chết dưới kệ trưng bày',
              'Gom rác toàn bộ cửa hàng mang đi đổ, khóa cửa khu vực vệ sinh',
              'Vệ sinh kỹ bồn rửa mặt/bồn demo và báo cáo leader nếu có dấu hiệu nghẹt bồn',
              'Báo cáo các hư hỏng vật chất phát sinh trong ngày'
            ]
          }
        ]
      }
    ]
  }
};

export const OPENING_CHECKLIST_TEMPLATE = [
  { id: 1, category: 'Grooming', task: 'Đồng phục đúng guideline' },
  { id: 2, category: 'Grooming', task: 'Tóc/makeup/bảng tên đúng chuẩn' },
  { id: 3, category: 'Store Cleanliness', task: 'Lau quầy cashier đặc biệt phía trước' },
  { id: 4, category: 'Store Cleanliness', task: 'Vệ sinh kệ sản phẩm/lau gương/lau tester/vệ sinh bồn rửa' },
  { id: 5, category: 'Store Cleanliness', task: 'Sàn sạch, không đọng nước, không dấu vết dơ' },
  { id: 6, category: 'Ambience', task: 'Nhạc mở đúng volume' },
  { id: 7, category: 'Ambience', task: 'Mùi hương cửa hàng ổn' },
  { id: 8, category: 'Electrical', task: 'Kiểm tra điện/camera' },
  { id: 9, category: 'Electrical', task: 'TV/đèn hoạt động' },
  { id: 10, category: 'POS', task: 'POS/internet hoạt động' },
  { id: 11, category: 'POS', task: 'QR payment hoạt động' },
  { id: 12, category: 'Cashier', task: 'Reserve fund đủ' },
  { id: 13, category: 'Cashier', task: 'Bill paper đầy đủ' },
  { id: 14, category: 'VM', task: 'Fill đá khu vực FFM, FFM nhìn có fresh chưa' },
  { id: 15, category: 'VM', task: 'Front/sub table đầy stock' },
  { id: 16, category: 'VM', task: 'Windows đúng guideline' },
  { id: 17, category: 'VM', task: 'Hàng hóa trên kệ có trưng bày đầy đủ' },
  { id: 18, category: 'Tester', task: 'Tester sạch & đầy đủ' },
  { id: 19, category: 'Tester', task: 'Thau nước để làm demo đã ready' },
  { id: 20, category: 'Activation', task: 'Sampling tools đầy đủ' },
  { id: 21, category: 'Activation', task: 'Demo area ready' },
  { id: 22, category: 'Stock', task: 'Xem hàng hóa đã FIFO, các hàng last chance đã để đúng khu vực' },
  { id: 23, category: 'Stock', task: 'Hàng CTKM có được để riêng ở cashier' },
  { id: 24, category: 'Team Brief', task: 'Daily target briefing' },
  { id: 25, category: 'Team Brief', task: 'KPI focus shared' }
];

export const SELLING_HOUR_TEMPLATE = [
  { id: 1, category: 'Customer Experience', task: 'Greeting active' },
  { id: 2, category: 'Customer Experience', task: 'Demo/sampling active' },
  { id: 3, category: 'Customer Experience', task: 'Staff positioning đúng' },
  { id: 4, category: 'Customer Experience', task: 'Customer engagement tốt' },
  { id: 5, category: 'Customer Experience', task: 'Upselling/link-selling' },
  { id: 6, category: 'Customer Experience', task: 'Member recruitment' },
  { id: 7, category: 'Store Recovery', task: 'Tester sạch' },
  { id: 8, category: 'Store Recovery', task: 'Refill hàng' },
  { id: 9, category: 'Store Recovery', task: 'Sink sạch' },
  { id: 10, category: 'Store Recovery', task: 'Shopping basket gọn' },
  { id: 11, category: 'Store Recovery', task: 'Front table đầy hàng' },
  { id: 12, category: 'Store Recovery', task: 'POP/VMD đúng guideline' }
];

export const KPI_TEMPLATES = [
  { key: 'sales', label: 'Sales (Doanh số)', unit: 'VNĐ', format: 'number' },
  { key: 'atv', label: 'ATV (Average Ticket Value)', unit: 'VNĐ', format: 'number' },
  { key: 'conversion', label: 'Conversion (Tỷ lệ chuyển đổi)', unit: '%', format: 'percent' },
  { key: 'upt', label: 'UPT (Units Per Transaction)', unit: 'sản phẩm', format: 'decimal' },
  { key: 'memberSignUp', label: 'Member sign-up', unit: 'khách hàng', format: 'number' },
  { key: 'samplingQty', label: 'Sampling qty', unit: 'phần', format: 'number' },
  { key: 'repeatCustomer', label: 'Repeat customer', unit: 'khách hàng', format: 'number' }
];

export const GRADING_CATEGORIES = [
  { key: 'grooming', label: 'Diện mạo & Tác phong (Grooming)', desc: 'Đồng phục, trang điểm, tóc tai, bảng tên nhân viên đúng chuẩn.' },
  { key: 'cleanliness', label: 'Vệ sinh cửa hàng (Cleanliness)', desc: 'Sàn nhà, quầy kệ cashier, gương soi, bồn demo sạch sẽ, không đọng nước.' },
  { key: 'vmd', label: 'Trưng bày & VMD (Visual Merchandising)', desc: 'Hàng hóa refill đầy đủ, bảng giá POP đúng chỗ, layout đúng guideline.' },
  { key: 'service', label: 'Dịch vụ & Trải nghiệm (Customer Experience)', desc: 'Chủ động chào đón khách, nhiệt tình làm demo/sampling, upselling/link-selling.' },
  { key: 'inventory', label: 'Quản lý hàng hóa & FIFO (Stock)', desc: 'Sắp xếp hàng hóa theo FIFO, xử lý hàng cận date/last chance.' },
  { key: 'cashier', label: 'Vận hành Quầy thu ngân (Cashier & POS)', desc: 'Chuẩn bị đủ quỹ reserve, hóa đơn giấy, QR payment hoạt động.' },
  { key: 'equipment', label: 'Thiết bị & Kỹ thuật (Technical)', desc: 'Hệ thống điện, camera, tivi, âm thanh hoạt động tốt, volume nhạc vừa đủ.' }
];

